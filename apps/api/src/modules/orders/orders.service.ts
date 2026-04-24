import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { nanoid } from 'nanoid';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId: string) {
    // Validate all items and lock inventory in a transaction
    return this.prisma.$transaction(async (tx) => {
      const lineItems: {
        productId: string;
        variantId?: string;
        configurationId?: string;
        sku: string;
        name: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }[] = [];

      let subtotal = 0;

      for (const item of dto.items) {
        if (item.configurationId) {
          const config = await tx.configuration.findFirst({
            where: { id: item.configurationId, userId },
            include: { product: true },
          });
          if (!config) throw new NotFoundException(`Configuration not found: ${item.configurationId}`);
          const unitPrice = Number(config.totalPrice);
          lineItems.push({
            productId: config.productId,
            configurationId: config.id,
            sku: config.product.sku,
            name: `${config.product.name} (Custom)`,
            quantity: 1,
            unitPrice,
            totalPrice: unitPrice,
          });
          subtotal += unitPrice;
          continue;
        }

        const product = await tx.product.findFirst({
          where: { id: item.productId, isActive: true },
          include: {
            variants: { where: { id: item.variantId ?? undefined } },
            inventoryItems: true,
          },
        });

        if (!product) throw new NotFoundException(`Product not found: ${item.productId}`);
        if (product.requiresQuote) {
          throw new BadRequestException(
            `Product "${product.name}" requires a quote — use the quote request flow`,
          );
        }

        const variant = item.variantId ? product.variants[0] : null;
        if (item.variantId && !variant) {
          throw new NotFoundException(`Variant not found: ${item.variantId}`);
        }

        // Check stock
        const availableStock = product.inventoryItems.reduce(
          (sum, i) => sum + i.quantityOnHand - i.quantityReserved,
          0,
        );
        if (availableStock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}" (available: ${availableStock})`,
          );
        }

        const unitPrice =
          Number(product.basePrice) + Number(variant?.priceDelta ?? 0);
        const totalPrice = unitPrice * item.quantity;

        lineItems.push({
          productId: product.id,
          variantId: variant?.id,
          sku: variant?.sku ?? product.sku,
          name: variant ? `${product.name} — ${variant.name}` : product.name,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        });
        subtotal += totalPrice;

        // Reserve inventory (deducted on shipment, released on cancel)
        for (const inv of product.inventoryItems) {
          await tx.inventoryItem.update({
            where: { id: inv.id },
            data: { quantityReserved: { increment: item.quantity } },
          });
        }
      }

      // French TVA — 20% standard rate on all goods
      // Only accessories go through checkout; robots require quote flow
      const TAX_RATE = 0.20;
      const taxTotal = subtotal * TAX_RATE;
      const shippingTotal = this.calculateShipping(subtotal);
      const total = subtotal + taxTotal + shippingTotal;

      const order = await tx.order.create({
        data: {
          orderNumber: `UT-${Date.now()}-${nanoid(4).toUpperCase()}`,
          userId,
          status: 'PENDING_PAYMENT',
          currency: 'EUR',
          subtotal,
          taxRate: TAX_RATE,
          taxLabel: 'TVA 20%',
          taxTotal,
          shippingTotal,
          total,
          shippingAddressId: dto.shippingAddressId,
          billingAddressId: dto.billingAddressId,
          customerNotes: dto.customerNotes,
          couponCode: dto.couponCode,
          items: {
            create: lineItems,
          },
        },
        include: { items: true },
      });

      await tx.orderStatusHistory.create({
        data: { orderId: order.id, status: 'PENDING_PAYMENT' },
      });

      return order;
    }, {
      // Serializable isolation prevents double-spending on inventory
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      timeout: 10_000,
    });
  }

  async findByUser(userId: string, page = 1, limit = 20) {
    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: { name: true, images: { where: { isPrimary: true }, take: 1 } },
              },
            },
          },
          shipments: true,
          payments: { select: { status: true, method: true, invoiceUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return { data: orders, meta: { total, page, limit } };
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: { include: { product: true, variant: true } },
        shipments: true,
        payments: true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
        shippingAddress: true,
        billingAddress: true,
        lease: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async cancel(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { items: { include: { product: { include: { inventoryItems: true } } } } },
    });

    if (!order) throw new NotFoundException('Order not found');

    const cancellable: OrderStatus[] = ['PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING'];
    if (!cancellable.includes(order.status)) {
      throw new BadRequestException(`Cannot cancel order in status: ${order.status}`);
    }

    return this.prisma.$transaction(async (tx) => {
      // Release reserved inventory
      for (const item of order.items) {
        for (const inv of item.product.inventoryItems) {
          await tx.inventoryItem.update({
            where: { id: inv.id },
            data: { quantityReserved: { decrement: item.quantity } },
          });
        }
      }

      const updated = await tx.order.update({
        where: { id },
        data: { status: 'CANCELLED', cancelledAt: new Date() },
      });

      await tx.orderStatusHistory.create({
        data: { orderId: id, status: 'CANCELLED', note: 'Cancelled by customer' },
      });

      return updated;
    });
  }

  private calculateShipping(subtotal: number): number {
    // Free shipping on orders > $5,000
    if (subtotal >= 5000) return 0;
    // Flat rate otherwise — replace with carrier rate API
    return 150;
  }
}
