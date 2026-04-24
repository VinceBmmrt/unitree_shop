import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { TokenService } from './token.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { templates } from '../email/templates';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { OAuthProvider } from '@prisma/client';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto, ipAddress: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      select: { id: true },
    });

    if (existing) {
      // Consistent timing to prevent user enumeration
      await bcrypt.hash('dummy', BCRYPT_ROUNDS);
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
      select: { id: true, email: true, role: true, firstName: true },
    });

    this.emailService.send(templates.welcomeEmail({ firstName: user.firstName, email: user.email })).catch(() => {});

    const tokens = await this.tokenService.generateTokenPair(user.id, ipAddress);
    return { user, ...tokens };
  }

  async login(dto: LoginDto, ipAddress: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    });

    // Always hash to prevent timing attacks even when user not found
    const isValid = user?.passwordHash
      ? await bcrypt.compare(dto.password, user.passwordHash)
      : await bcrypt.hash('dummy', BCRYPT_ROUNDS).then(() => false);

    if (!user || !isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account suspended');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.tokenService.generateTokenPair(
      user.id,
      ipAddress,
      userAgent,
    );

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, ...tokens };
  }

  async refreshTokens(refreshToken: string, ipAddress: string) {
    return this.tokenService.rotateRefreshToken(refreshToken, ipAddress);
  }

  async logout(refreshToken: string) {
    await this.tokenService.revokeRefreshToken(refreshToken);
  }

  async handleOAuthCallback(
    provider: OAuthProvider,
    profile: {
      providerId: string;
      email: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    },
    ipAddress: string,
  ) {
    // Find or create via OAuth account link
    let oauthAccount = await this.prisma.oAuthAccount.findUnique({
      where: { provider_providerId: { provider, providerId: profile.providerId } },
      include: { user: { select: { id: true, isActive: true, role: true } } },
    });

    if (oauthAccount) {
      if (!oauthAccount.user.isActive) {
        throw new UnauthorizedException('Account suspended');
      }
      const tokens = await this.tokenService.generateTokenPair(
        oauthAccount.user.id,
        ipAddress,
      );
      return { user: oauthAccount.user, ...tokens };
    }

    // Check if email already exists — link accounts if so
    const existingUser = await this.prisma.user.findUnique({
      where: { email: profile.email.toLowerCase() },
      select: { id: true, isActive: true, role: true },
    });

    const userId = existingUser
      ? existingUser.id
      : (
          await this.prisma.user.create({
            data: {
              email: profile.email.toLowerCase(),
              firstName: profile.firstName,
              lastName: profile.lastName,
              avatar: profile.avatar,
              emailVerified: new Date(),
            },
            select: { id: true },
          })
        ).id;

    await this.prisma.oAuthAccount.create({
      data: { provider, providerId: profile.providerId, userId },
    });

    const tokens = await this.tokenService.generateTokenPair(userId, ipAddress);
    return { user: { id: userId }, ...tokens };
  }
}
