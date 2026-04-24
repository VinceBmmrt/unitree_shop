import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { templates } from '../email/templates';
import { CreateQuoteRequestDto } from './dto/create-quote-request.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuoteStatus } from '@prisma/client';
import { addDays } from 'date-fns';

@Injectable()
export class QuotesService {
  private readonly logger = new Logger(QuotesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
  ) {}

  // ── PUBLIC: customer submits a quote request ──────────────────────────────

  async createRequest(dto: CreateQuoteRequestDto, userId?: string, ipAddress?: string) {
    if (!dto.gdprConsent) {
      throw new BadRequestException(
        'GDPR consent is required to submit a quote request',
      );
    }

    // Validate all requested products exist and are quotable
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      select: { id: true, name: true, basePrice: true, requiresQuote: true },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    const nonQuotable = products.filter((p) => !p.requiresQuote);
    if (nonQuotable.length > 0) {
      throw new BadRequestException(
        `Products not available via quote: ${nonQuotable.map((p) => p.name).join(', ')}. Use checkout instead.`,
      );
    }

    // Build quote items with list price as initial estimate
    const items = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const unitPrice = Number(product.basePrice);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        discount: 0,
        totalPrice: unitPrice * item.quantity,
        notes: item.notes,
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);

    // Attach to user account if logged in, otherwise create as guest lead
    let resolvedUserId = userId;
    if (!resolvedUserId) {
      // Find by email if they've submitted before
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
        select: { id: true },
      });
      resolvedUserId = existing?.id;
    }

    // Log GDPR consent for this quote submission
    if (ipAddress) {
      await this.prisma.gdprConsent.create({
        data: {
          userId: resolvedUserId,
          essential: true,
          analytics: false,
          marketing: false,
          ipAddress,
          consentedAt: new Date(),
        },
      }).catch(() => {}); // non-blocking — consent store failure must not block quote
    }

    const quote = await this.prisma.quote.create({
      data: {
        quoteNumber: `QT-${Date.now()}-${nanoid(4).toUpperCase()}`,
        customerId: resolvedUserId ?? (await this.ensureGuestUser(dto)),
        status: 'DRAFT',
        currency: 'EUR',
        subtotal,
        discount: 0,
        taxTotal: subtotal * 0.20, // TVA 20% — indicative, final on invoice
        total: subtotal * 1.20,
        validUntil: addDays(new Date(), 30),
        notes: [
          dto.useCase && `Cas d'usage: ${dto.useCase}`,
          dto.timeline && `Délai: ${dto.timeline}`,
          dto.budget && `Budget indicatif: ${dto.budget.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`,
          dto.requestsFinancing && 'Financement/leasing souhaité',
          dto.preferredContact && `Contact préféré: ${dto.preferredContact}`,
          dto.additionalNotes,
        ]
          .filter(Boolean)
          .join('\n'),
        items: { create: items },
      },
      include: { items: { include: { product: { select: { name: true } } } } },
    });

    // Send emails (non-blocking)
    const salesEmail = this.config.get<string>('SALES_EMAIL', 'sales@unitree-robotics.fr');
    Promise.all([
      this.emailService.send(templates.quoteReceivedCustomer({
        to: dto.email,
        firstName: dto.firstName,
        quoteNumber: quote.quoteNumber,
        items: quote.items.map((i) => ({ name: i.product.name, quantity: i.quantity })),
      })),
      this.emailService.send(templates.quoteReceivedTeam({
        to: salesEmail,
        quoteId: quote.id,
        quoteNumber: quote.quoteNumber,
        customerName: `${dto.firstName} ${dto.lastName}`,
        customerEmail: dto.email,
        companyName: dto.companyName,
        total: Number(quote.total),
        requestsFinancing: dto.requestsFinancing,
      })),
    ]).catch((err) => this.logger.error('Failed to send quote emails', err));

    return {
      quoteNumber: quote.quoteNumber,
      message: 'Votre demande de devis a bien été reçue. Notre équipe vous contactera sous 48h ouvrées.',
    };
  }

  // ── CUSTOMER: track their quote status ───────────────────────────────────

  async findByUser(userId: string, page = 1, limit = 20) {
    const [quotes, total] = await this.prisma.$transaction([
      this.prisma.quote.findMany({
        where: { customerId: userId },
        include: {
          items: {
            include: { product: { select: { name: true, images: { where: { isPrimary: true }, take: 1 } } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.quote.count({ where: { customerId: userId } }),
    ]);

    return { data: quotes, meta: { total, page, limit } };
  }

  async findOneByUser(id: string, userId: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id, customerId: userId },
      include: {
        items: { include: { product: { include: { images: true } } } },
        salesRep: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    if (!quote) throw new NotFoundException('Quote not found');
    return quote;
  }

  async acceptQuote(id: string, userId: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id, customerId: userId },
    });

    if (!quote) throw new NotFoundException('Quote not found');
    if (quote.status !== 'SENT' && quote.status !== 'VIEWED') {
      throw new BadRequestException(
        `Cannot accept quote in status: ${quote.status}`,
      );
    }
    if (quote.validUntil < new Date()) {
      throw new BadRequestException('Quote has expired — please request a new one');
    }

    return this.prisma.quote.update({
      where: { id },
      data: { status: 'ACCEPTED' },
    });
  }

  async rejectQuote(id: string, userId: string, reason?: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id, customerId: userId },
    });

    if (!quote) throw new NotFoundException('Quote not found');

    return this.prisma.quote.update({
      where: { id },
      data: {
        status: 'REJECTED',
        notes: reason
          ? `${quote.notes ?? ''}\n[Refusé par le client: ${reason}]`.trim()
          : quote.status,
      },
    });
  }

  // ── ADMIN: quote management ───────────────────────────────────────────────

  async findAll(
    page = 1,
    limit = 25,
    status?: QuoteStatus,
    search?: string,
  ) {
    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { quoteNumber: { contains: search, mode: 'insensitive' as const } },
          { customer: { email: { contains: search, mode: 'insensitive' as const } } },
          {
            customer: {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' as const } },
                { lastName: { contains: search, mode: 'insensitive' as const } },
              ],
            },
          },
        ],
      }),
    };

    const [quotes, total] = await this.prisma.$transaction([
      this.prisma.quote.findMany({
        where,
        include: {
          customer: { select: { id: true, email: true, firstName: true, lastName: true } },
          salesRep: { select: { id: true, firstName: true, lastName: true } },
          items: { select: { quantity: true, totalPrice: true, product: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.quote.count({ where }),
    ]);

    return { data: quotes, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOneAdmin(id: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      include: {
        customer: true,
        salesRep: { select: { id: true, email: true, firstName: true, lastName: true } },
        items: { include: { product: { include: { images: true } } } },
        orders: { select: { id: true, orderNumber: true, status: true } },
      },
    });

    if (!quote) throw new NotFoundException('Quote not found');
    return quote;
  }

  async update(id: string, dto: UpdateQuoteDto, adminId: string) {
    const quote = await this.prisma.quote.findUnique({ where: { id } });
    if (!quote) throw new NotFoundException('Quote not found');

    const terminalStatuses: QuoteStatus[] = ['CONVERTED', 'REJECTED', 'EXPIRED'];
    if (terminalStatuses.includes(quote.status)) {
      throw new BadRequestException(`Quote is in terminal status: ${quote.status}`);
    }

    return this.prisma.$transaction(async (tx) => {
      // Replace items if provided
      if (dto.items?.length) {
        await tx.quoteItem.deleteMany({ where: { quoteId: id } });

        const productIds = dto.items.map((i) => i.productId);
        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true },
        });
        if (products.length !== productIds.length) {
          throw new NotFoundException('One or more products not found');
        }

        const newItems = dto.items.map((i) => ({
          quoteId: id,
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          discount: i.discount ?? 0,
          totalPrice: (i.unitPrice - (i.discount ?? 0)) * i.quantity,
          notes: i.notes,
        }));

        await tx.quoteItem.createMany({ data: newItems });

        const subtotal = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
        const discountTotal = dto.discount ?? Number(quote.discount);
        const taxTotal = (subtotal - discountTotal) * 0.20;
        const total = subtotal - discountTotal + taxTotal;

        await tx.quote.update({
          where: { id },
          data: { subtotal, discount: discountTotal, taxTotal, total },
        });
      }

      const updated = await tx.quote.update({
        where: { id },
        data: {
          ...(dto.status && { status: dto.status }),
          ...(dto.notes !== undefined && { notes: dto.notes }),
          ...(dto.internalNotes !== undefined && { internalNotes: dto.internalNotes }),
          ...(dto.validUntil && { validUntil: new Date(dto.validUntil) }),
          ...(dto.salesRepId && { salesRepId: dto.salesRepId }),
          ...(dto.discount !== undefined && { discount: dto.discount }),
        },
      });

      // Email customer when quote is sent
      if (dto.status === 'SENT') {
        const customer = await tx.user.findUnique({
          where: { id: quote.customerId },
          select: { email: true, firstName: true },
        });

        if (customer) {
          this.emailService.send(templates.quoteSentCustomer({
            to: customer.email,
            firstName: customer.firstName,
            quoteNumber: quote.quoteNumber,
            quoteId: id,
            total: Number(updated.total),
            validUntil: updated.validUntil,
          })).catch((err) => this.logger.error('Email send failed', err));
        }
      }

      return updated;
    });
  }

  async convertToOrder(quoteId: string, adminId: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        items: true,
        customer: { select: { id: true, addresses: { where: { isDefault: true }, take: 1 } } },
      },
    });

    if (!quote) throw new NotFoundException('Quote not found');
    if (quote.status !== 'ACCEPTED') {
      throw new BadRequestException('Only accepted quotes can be converted to orders');
    }

    const defaultAddress = quote.customer.addresses[0];

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: `UT-${Date.now()}-${nanoid(4).toUpperCase()}`,
          userId: quote.customerId,
          status: 'CONFIRMED',
          currency: quote.currency,
          subtotal: quote.subtotal,
          taxTotal: quote.taxTotal,
          total: quote.total,
          taxRate: 0.20,
          taxLabel: 'TVA 20%',
          quoteId: quote.id,
          shippingAddressId: defaultAddress?.id,
          billingAddressId: defaultAddress?.id,
          confirmedAt: new Date(),
          items: {
            create: await Promise.all(
              quote.items.map(async (qi) => {
                const product = await tx.product.findUniqueOrThrow({
                  where: { id: qi.productId },
                  select: { name: true, sku: true },
                });
                return {
                  productId: qi.productId,
                  sku: product.sku,
                  name: product.name,
                  quantity: qi.quantity,
                  unitPrice: qi.unitPrice,
                  totalPrice: qi.totalPrice,
                  taxAmount: Number(qi.totalPrice) * 0.20,
                };
              }),
            ),
          },
        },
      });

      await tx.quote.update({
        where: { id: quoteId },
        data: { status: 'CONVERTED' },
      });

      return newOrder;
    });

    return order;
  }

  // ── PRIVATE helpers ───────────────────────────────────────────────────────

  private async ensureGuestUser(dto: CreateQuoteRequestDto): Promise<string> {
    // Create a passwordless guest account for tracking
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      },
      select: { id: true },
    });
    return user.id;
  }
}
