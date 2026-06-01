import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRevenueSummary(startDate: Date, endDate: Date) {
    const orders = await this.prisma.order.findMany({
      where: {
        status: {
          in: [OrderStatus.CONFIRMED, OrderStatus.DELIVERED, OrderStatus.SHIPPED],
        },
        confirmedAt: { gte: startDate, lte: endDate },
      },
      select: {
        total: true,
        confirmedAt: true,
        currency: true,
        items: { select: { totalPrice: true, product: { select: { category: true } } } },
      },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const orderCount = orders.length;
    const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    // Group by day
    const dailyRevenue = orders.reduce((acc: Record<string, number>, order) => {
      const day = order.confirmedAt!.toISOString().split('T')[0];
      acc[day] = (acc[day] ?? 0) + Number(order.total);
      return acc;
    }, {});

    // Revenue by product category
    const categoryRevenue = orders
      .flatMap((o) => o.items)
      .reduce((acc: Record<string, number>, item) => {
        const cat = item.product.category;
        acc[cat] = (acc[cat] ?? 0) + Number(item.totalPrice);
        return acc;
      }, {});

    return {
      totalRevenue,
      orderCount,
      avgOrderValue,
      dailyRevenue: Object.entries(dailyRevenue)
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      categoryRevenue: Object.entries(categoryRevenue).map(([category, revenue]) => ({
        category,
        revenue,
      })),
    };
  }

  async getTopProducts(limit = 10) {
    const result = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          status: { in: [OrderStatus.CONFIRMED, OrderStatus.DELIVERED, OrderStatus.SHIPPED] },
        },
      },
      _sum: { totalPrice: true, quantity: true },
      orderBy: { _sum: { totalPrice: 'desc' } },
      take: limit,
    });

    const productIds = result.map((r) => r.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, sku: true, category: true },
    });

    return result.map((r) => {
      const product = products.find((p) => p.id === r.productId);
      return {
        ...product,
        totalRevenue: Number(r._sum.totalPrice ?? 0),
        unitsSold: r._sum.quantity ?? 0,
      };
    });
  }

  async getOrderFunnel() {
    const statuses = Object.values(OrderStatus);
    const counts = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    return statuses.map((status) => ({
      status,
      count: counts.find((c) => c.status === status)?._count.id ?? 0,
    }));
  }

  async getCustomerMetrics() {
    const [totalUsers, newUsersThisMonth, enterpriseCount] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      this.prisma.enterprise.count(),
    ]);

    // Repeat purchase rate
    const multiOrderUsers = await this.prisma.order.groupBy({
      by: ['userId'],
      where: { status: { not: OrderStatus.CANCELLED } },
      having: { userId: { _count: { gt: 1 } } },
      _count: { userId: true },
    });

    return {
      totalUsers,
      newUsersThisMonth,
      enterpriseCount,
      repeatBuyerCount: multiOrderUsers.length,
    };
  }

  async getLowStockAlerts(threshold = 5) {
    return this.prisma.inventoryItem.findMany({
      where: {
        quantityOnHand: { lte: threshold },
      },
      include: {
        product: { select: { name: true, sku: true, category: true } },
        warehouse: { select: { name: true, code: true } },
      },
      orderBy: { quantityOnHand: 'asc' },
    });
  }
}
