import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

class ConsentDto {
  @IsBoolean() analytics: boolean;
  @IsBoolean() marketing: boolean;
  @IsOptional() @IsString() sessionId?: string;
}

@ApiTags('gdpr')
@Controller({ path: 'gdpr', version: '1' })
@UseGuards(JwtAuthGuard)
export class GdprController {
  constructor(private readonly prisma: PrismaService) {}

  // Cookie consent — can be submitted anonymously
  @Post('consent')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record user cookie consent (GDPR Art. 7)' })
  async recordConsent(@Body() dto: ConsentDto, @Req() req: FastifyRequest & { user?: any }) {
    const userId = req.user?.id;
    await this.prisma.gdprConsent.create({
      data: {
        userId,
        sessionId: dto.sessionId,
        analytics: dto.analytics,
        marketing: dto.marketing,
        essential: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        bannerVersion: '1.0',
      },
    });
    return { recorded: true };
  }

  // Data export — GDPR Art. 20 (portabilité des données)
  @Get('export')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export all personal data (GDPR portability)' })
  async exportData(@CurrentUser('id') userId: string) {
    const [user, orders, quotes, tickets, consents] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          createdAt: true,
          addresses: true,
        },
      }),
      this.prisma.order.findMany({
        where: { userId },
        select: {
          orderNumber: true,
          status: true,
          total: true,
          currency: true,
          createdAt: true,
        },
      }),
      this.prisma.quote.findMany({
        where: { customerId: userId },
        select: { quoteNumber: true, status: true, total: true, createdAt: true },
      }),
      this.prisma.supportTicket.findMany({
        where: { userId },
        select: { ticketNumber: true, subject: true, status: true, createdAt: true },
      }),
      this.prisma.gdprConsent.findMany({
        where: { userId },
        select: { analytics: true, marketing: true, consentedAt: true, withdrawnAt: true },
      }),
    ]);

    return {
      exportedAt: new Date().toISOString(),
      profile: user,
      orders,
      quotes,
      supportTickets: tickets,
      consentHistory: consents,
    };
  }

  // Erasure request — GDPR Art. 17 (droit à l'effacement)
  @Delete('me')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Request account deletion (GDPR right to erasure)' })
  async requestDeletion(@CurrentUser('id') userId: string, @Body('reason') reason?: string) {
    // Create deletion request; admin processes it (can't instant-delete due to order records)
    await this.prisma.dataDeletionRequest.upsert({
      where: { userId },
      create: { userId, notes: reason },
      update: { requestedAt: new Date(), processedAt: null, status: 'PENDING', notes: reason },
    });

    return {
      message:
        'Votre demande de suppression a été enregistrée. Elle sera traitée dans les 30 jours conformément au RGPD.',
      requestedAt: new Date().toISOString(),
    };
  }
}
