import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '@unitree/types';

@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly refreshExpiresMs: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    this.accessSecret = config.getOrThrow('JWT_ACCESS_SECRET');
    this.refreshSecret = config.getOrThrow('JWT_REFRESH_SECRET');
    // Default: 7 days
    this.refreshExpiresMs = config.get('JWT_REFRESH_EXPIRES_DAYS', 7) * 86_400_000;
  }

  async generateTokenPair(userId: string, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, role: true },
    });

    const payload: JwtPayload = { sub: user.id, role: user.role };

    const accessToken = this.jwt.sign(payload, {
      secret: this.accessSecret,
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES', '15m'),
    });

    // Refresh token is an opaque random token stored hashed in DB
    const rawRefreshToken = crypto.randomBytes(48).toString('base64url');
    const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    await this.prisma.refreshToken.create({
      data: {
        token: tokenHash,
        userId,
        expiresAt: new Date(Date.now() + this.refreshExpiresMs),
        ipAddress,
        userAgent,
      },
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  async rotateRefreshToken(rawToken: string, ipAddress?: string) {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: tokenHash },
      include: { user: { select: { id: true, role: true, isActive: true } } },
    });

    if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
      // Revoke all tokens for this user on suspected token reuse
      if (stored) {
        await this.prisma.refreshToken.updateMany({
          where: { userId: stored.userId },
          data: { isRevoked: true },
        });
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (!stored.user.isActive) {
      throw new UnauthorizedException('Account suspended');
    }

    // Rotate: revoke old, issue new
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { isRevoked: true },
    });

    return this.generateTokenPair(stored.userId, ipAddress);
  }

  async revokeRefreshToken(rawToken: string) {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    await this.prisma.refreshToken.updateMany({
      where: { token: tokenHash },
      data: { isRevoked: true },
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return this.jwt.verify<JwtPayload>(token, { secret: this.accessSecret });
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
