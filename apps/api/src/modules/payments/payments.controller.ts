import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  RawBodyRequest,
  Headers,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Throttle } from '@nestjs/throttler';

@ApiTags('payments')
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('orders/:orderId/intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Throttle({ global: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Create Stripe payment intent for an order' })
  createPaymentIntent(
    @Param('orderId') orderId: string,
    @Body() dto: CreatePaymentIntentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.paymentsService.createPaymentIntent(orderId, dto, userId);
  }

  @Post('orders/:orderId/invoice')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Throttle({ global: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Create and send NET30/NET60 invoice for enterprise order' })
  createInvoice(
    @Param('orderId') orderId: string,
    @Body('netDays') netDays: 30 | 60,
    @CurrentUser('id') userId: string,
  ) {
    return this.paymentsService.createInvoice(orderId, userId, netDays);
  }

  @Post('orders/:orderId/lease')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Throttle({ global: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Create lease/financing schedule for an order' })
  createLease(
    @Param('orderId') orderId: string,
    @Body() dto: CreateLeaseDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.paymentsService.createLeaseSchedule(orderId, dto, userId);
  }

  // Stripe sends webhooks here — raw body required for signature verification
  // This endpoint must NOT use the global validation pipe (body is raw Buffer)
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @Throttle({ global: { limit: 1000, ttl: 60000 } })
  @ApiOperation({ summary: 'Stripe webhook receiver (internal)' })
  handleWebhook(
    @Req() req: RawBodyRequest<FastifyRequest>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleWebhook(
      req.rawBody as Buffer,
      signature,
    );
  }
}
