import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Optional,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { QuotesService } from './quotes.service';
import { CreateQuoteRequestDto } from './dto/create-quote-request.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole, QuoteStatus } from '@prisma/client';

@ApiTags('quotes')
@Controller({ path: 'quotes', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  // ── Public: submit a quote request (logged in or not) ──────────────────

  @Post('request')
  @Public()
  @Throttle({ global: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a robot quote request' })
  async createRequest(
    @Body() dto: CreateQuoteRequestDto,
    @Req() req: FastifyRequest & { user?: any },
    @Optional() @CurrentUser('id') userId?: string,
  ) {
    return this.quotesService.createRequest(dto, userId, req.ip);
  }

  // ── Customer: track their own quotes ────────────────────────────────────

  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my quotes' })
  findMy(@CurrentUser('id') userId: string, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.quotesService.findByUser(userId, +page, +limit);
  }

  @Get('my/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get quote detail' })
  findMyOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.quotesService.findOneByUser(id, userId);
  }

  @Post('my/:id/accept')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept a received quote' })
  accept(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.quotesService.acceptQuote(id, userId);
  }

  @Post('my/:id/reject')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a received quote' })
  reject(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body('reason') reason?: string,
  ) {
    return this.quotesService.rejectQuote(id, userId, reason);
  }

  // ── Admin: full quote pipeline management ───────────────────────────────

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SALES_REP)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] List all quotes' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 25,
    @Query('status') status?: QuoteStatus,
    @Query('search') search?: string,
  ) {
    return this.quotesService.findAll(+page, +limit, status, search);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SALES_REP)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get full quote detail' })
  findOne(@Param('id') id: string) {
    return this.quotesService.findOneAdmin(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SALES_REP)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update quote — pricing, status, assignment' })
  update(@Param('id') id: string, @Body() dto: UpdateQuoteDto, @CurrentUser('id') adminId: string) {
    return this.quotesService.update(id, dto, adminId);
  }

  @Post(':id/convert')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '[Admin] Convert accepted quote to confirmed order' })
  convert(@Param('id') id: string, @CurrentUser('id') adminId: string) {
    return this.quotesService.convertToOrder(id, adminId);
  }
}
