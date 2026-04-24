import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from '../analytics/analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('admin')
@Controller({ path: 'admin', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('analytics/revenue')
  @ApiOperation({ summary: 'Revenue summary for date range' })
  getRevenue(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.analyticsService.getRevenueSummary(
      new Date(from),
      new Date(to),
    );
  }

  @Get('analytics/products')
  @ApiOperation({ summary: 'Top performing products' })
  getTopProducts(@Query('limit') limit = 10) {
    return this.analyticsService.getTopProducts(+limit);
  }

  @Get('analytics/funnel')
  @ApiOperation({ summary: 'Order status funnel' })
  getOrderFunnel() {
    return this.analyticsService.getOrderFunnel();
  }

  @Get('analytics/customers')
  @ApiOperation({ summary: 'Customer metrics' })
  getCustomerMetrics() {
    return this.analyticsService.getCustomerMetrics();
  }

  @Get('inventory/alerts')
  @ApiOperation({ summary: 'Low stock alerts' })
  getLowStockAlerts(@Query('threshold') threshold = 5) {
    return this.analyticsService.getLowStockAlerts(+threshold);
  }
}
