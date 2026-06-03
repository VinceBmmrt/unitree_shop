import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { CreateLeaseDto } from './dto/create-lease.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);
  private readonly webhookSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.stripe = new Stripe(config.getOrThrow('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-04-10',
      typescript: true,
      maxNetworkRetries: 3,
    });
    this.webhookSecret = config.getOrThrow('STRIPE_WEBHOOK_SECRET');
  }

  async createPaymentIntent(orderId: string, dto: CreatePaymentIntentDto, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'PENDING_PAYMENT') {
      throw new BadRequestException('Order is not awaiting payment');
    }

    // Idempotency: if intent already exists, return it
    if (order.stripePaymentIntentId) {
      const existing = await this.stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
      return { clientSecret: existing.client_secret };
    }

    const intent = await this.stripe.paymentIntents.create(
      {
        amount: Math.round(Number(order.total) * 100), // cents
        currency: order.currency.toLowerCase(),
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          userId,
        },
        // Automatic payment methods — Stripe handles card networks, wallets, etc.
        automatic_payment_methods: { enabled: true },
        // Statement descriptor visible on bank statement
        statement_descriptor_suffix: 'UNITREE',
        // Capture immediately unless requiresQuote (then manual capture)
        capture_method: dto.useManualCapture ? 'manual' : 'automatic',
      },
      // Idempotency key prevents duplicate charges on retry
      { idempotencyKey: `pi_${orderId}` },
    );

    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: orderId },
        data: {
          stripePaymentIntentId: intent.id,
          status: 'PAYMENT_PROCESSING',
        },
      }),
      this.prisma.payment.create({
        data: {
          orderId,
          stripePaymentIntentId: intent.id,
          amount: order.total,
          currency: order.currency,
          status: 'PROCESSING',
          method: dto.method ?? 'CARD',
        },
      }),
    ]);

    return { clientSecret: intent.client_secret };
  }

  async createInvoice(orderId: string, userId: string, netDays: 30 | 60 = 30) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (Number(order.total) < 10_000) {
      throw new BadRequestException('Invoice payment requires minimum $10,000 order');
    }

    // Get or create Stripe customer
    const customerId = await this.getStripeCustomerId(userId);

    const invoice = await this.stripe.invoices.create({
      customer: customerId,
      collection_method: 'send_invoice',
      days_until_due: netDays,
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
      footer: 'Unitree Robotics — Payment due per terms',
    });

    for (const item of order.items) {
      await this.stripe.invoiceItems.create({
        customer: customerId,
        invoice: invoice.id,
        description: item.name,
        quantity: item.quantity,
        unit_amount: Math.round(Number(item.unitPrice) * 100),
        currency: order.currency.toLowerCase(),
      });
    }

    const finalized = await this.stripe.invoices.finalizeInvoice(invoice.id);
    await this.stripe.invoices.sendInvoice(finalized.id);

    await this.prisma.payment.create({
      data: {
        orderId,
        stripeInvoiceId: finalized.id,
        amount: order.total,
        currency: order.currency,
        status: 'PENDING',
        method: netDays === 30 ? 'INVOICE_NET30' : 'INVOICE_NET60',
        invoiceUrl: finalized.hosted_invoice_url ?? undefined,
      },
    });

    return { invoiceUrl: finalized.hosted_invoice_url };
  }

  async createLeaseSchedule(orderId: string, dto: CreateLeaseDto, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) throw new NotFoundException('Order not found');

    const principal = Number(order.total);
    const monthlyRate = dto.annualRate / 12 / 100;
    const n = dto.termMonths;

    // Standard amortization formula
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);

    const customerId = await this.getStripeCustomerId(userId);

    const schedule = await this.stripe.subscriptionSchedules.create({
      customer: customerId,
      start_date: Math.floor(Date.now() / 1000),
      end_behavior: 'cancel',
      phases: [
        {
          items: [
            {
              price_data: {
                currency: order.currency.toLowerCase(),
                product: undefined,
                product_data: { name: `Unitree Lease — Order ${order.orderNumber}` },
                unit_amount: Math.round(monthlyPayment * 100),
                recurring: { interval: 'month' },
              } as any,
              quantity: 1,
            },
          ],
          iterations: dto.termMonths,
        },
      ],
      metadata: { orderId, orderNumber: order.orderNumber ?? '' },
    } as any);

    await this.prisma.lease.create({
      data: {
        orderId,
        monthlyPayment,
        termMonths: dto.termMonths,
        totalAmount: monthlyPayment * dto.termMonths,
        interestRate: dto.annualRate / 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + dto.termMonths * 30 * 24 * 60 * 60 * 1000),
        stripeScheduleId: schedule.id,
      },
    });

    return { monthlyPayment: monthlyPayment.toFixed(2), scheduleId: schedule.id };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${(err as Error).message}`);
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`Stripe event: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'charge.dispute.created':
        await this.handleDisputeCreated(event.data.object as Stripe.Dispute);
        break;

      default:
        this.logger.debug(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentSucceeded(intent: Stripe.PaymentIntent) {
    const orderId = intent.metadata.orderId;
    if (!orderId) return;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });
    if (order?.status === 'CONFIRMED') return; // already processed — Stripe retry

    await this.prisma.$transaction([
      this.prisma.payment.updateMany({
        where: { stripePaymentIntentId: intent.id },
        data: {
          status: 'SUCCEEDED',
          receiptUrl: (intent as any).latest_charge?.receipt_url,
        },
      }),
      this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED', confirmedAt: new Date() },
      }),
      this.prisma.orderStatusHistory.create({
        data: { orderId, status: 'CONFIRMED', note: 'Payment confirmed via Stripe' },
      }),
    ]);

    // TODO: trigger fulfillment queue job
  }

  private async handlePaymentFailed(intent: Stripe.PaymentIntent) {
    const orderId = intent.metadata.orderId;
    if (!orderId) return;

    await this.prisma.$transaction([
      this.prisma.payment.updateMany({
        where: { stripePaymentIntentId: intent.id },
        data: { status: 'FAILED' },
      }),
      this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAYMENT_FAILED' },
      }),
    ]);
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    const orderId = invoice.metadata?.orderId;
    if (!orderId) return;

    await this.prisma.$transaction([
      this.prisma.payment.updateMany({
        where: { stripeInvoiceId: invoice.id },
        data: { status: 'SUCCEEDED' },
      }),
      this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED', confirmedAt: new Date() },
      }),
    ]);
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const orderId = invoice.metadata?.orderId;
    if (!orderId) return;

    await this.prisma.payment.updateMany({
      where: { stripeInvoiceId: invoice.id },
      data: { status: 'FAILED' },
    });
  }

  private async handleDisputeCreated(dispute: Stripe.Dispute) {
    this.logger.warn(`Dispute created: ${dispute.id} — charge: ${dispute.charge}`);
    // TODO: notify finance team via email queue
  }

  private async getStripeCustomerId(userId: string): Promise<string> {
    // Cache Stripe customer ID in user metadata — check if already created
    // In production, use Redis cache here: key = `stripe_customer_id:${userId}`
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { email: true, firstName: true, lastName: true },
    });

    const existing = await this.stripe.customers.search({
      query: `metadata['userId']:'${userId}'`,
      limit: 1,
    });

    if (existing.data.length > 0) return existing.data[0].id;

    const customer = await this.stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: { userId },
    });

    return customer.id;
  }
}
