import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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
    private readonly jwt: JwtService,
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

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, firstName: true, email: true, isActive: true },
    });

    // Always resolve without error — prevents email enumeration
    if (!user || !user.isActive) return;

    const resetSecret = `${this.config.getOrThrow('JWT_ACCESS_SECRET')}:password-reset`;
    const token = this.jwt.sign(
      { sub: user.id, purpose: 'password-reset' },
      { secret: resetSecret, expiresIn: '1h' },
    );

    const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = `${frontendUrl}/compte/reinitialiser-mot-de-passe?token=${token}`;

    this.emailService
      .send(templates.passwordResetEmail({ email: user.email, firstName: user.firstName, resetUrl }))
      .catch(() => {});
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetSecret = `${this.config.getOrThrow('JWT_ACCESS_SECRET')}:password-reset`;

    let payload: { sub: string; purpose: string };
    try {
      payload = this.jwt.verify(token, { secret: resetSecret }) as typeof payload;
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (payload.purpose !== 'password-reset') {
      throw new BadRequestException('Invalid reset token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new BadRequestException('Invalid reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      // Revoke all refresh tokens so existing sessions must re-authenticate
      this.prisma.refreshToken.updateMany({
        where: { userId: user.id },
        data: { isRevoked: true },
      }),
    ]);
  }

  getGoogleOAuthUrl(): string {
    const clientId = this.config.get('GOOGLE_CLIENT_ID', '');
    if (!clientId || clientId === 'disabled') {
      throw new BadRequestException('Google OAuth is not configured');
    }
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${this.config.get('API_URL', 'http://localhost:3001')}/api/v1/auth/google/callback`,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeGoogleCode(code: string, ipAddress: string) {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: this.config.get('GOOGLE_CLIENT_ID'),
        client_secret: this.config.get('GOOGLE_CLIENT_SECRET'),
        redirect_uri: `${this.config.get('API_URL', 'http://localhost:3001')}/api/v1/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = (await tokenRes.json()) as Record<string, string>;
    if (!tokens.access_token) {
      throw new UnauthorizedException('Google token exchange failed');
    }

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = (await profileRes.json()) as Record<string, string>;

    return this.handleOAuthCallback(
      'GOOGLE',
      {
        providerId: profile.id,
        email: profile.email,
        firstName: profile.given_name ?? profile.name?.split(' ')[0] ?? 'User',
        lastName: profile.family_name ?? profile.name?.split(' ').slice(1).join(' ') ?? '',
        avatar: profile.picture,
      },
      ipAddress,
    );
  }

  getGitHubOAuthUrl(): string {
    const clientId = this.config.get('GITHUB_CLIENT_ID', '');
    if (!clientId || clientId === 'disabled') {
      throw new BadRequestException('GitHub OAuth is not configured');
    }
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${this.config.get('API_URL', 'http://localhost:3001')}/api/v1/auth/github/callback`,
      scope: 'user:email',
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  async exchangeGitHubCode(code: string, ipAddress: string) {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        code,
        client_id: this.config.get('GITHUB_CLIENT_ID'),
        client_secret: this.config.get('GITHUB_CLIENT_SECRET'),
        redirect_uri: `${this.config.get('API_URL', 'http://localhost:3001')}/api/v1/auth/github/callback`,
      }),
    });

    const tokens = (await tokenRes.json()) as Record<string, string>;
    if (!tokens.access_token) {
      throw new UnauthorizedException('GitHub token exchange failed');
    }

    const profileRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        'User-Agent': 'Unitree-Shop',
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const profile = (await profileRes.json()) as Record<string, string>;

    let email = profile.email;
    if (!email) {
      const emailsRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          'User-Agent': 'Unitree-Shop',
          Accept: 'application/vnd.github.v3+json',
        },
      });
      const emails = (await emailsRes.json()) as { email: string; primary: boolean }[];
      email = emails.find((e) => e.primary)?.email ?? emails[0]?.email ?? '';
    }

    if (!email) throw new UnauthorizedException('Could not retrieve email from GitHub');

    const nameParts = (profile.name ?? profile.login ?? '').split(' ');
    return this.handleOAuthCallback(
      'GITHUB',
      {
        providerId: String(profile.id),
        email,
        firstName: nameParts[0] || profile.login || 'User',
        lastName: nameParts.slice(1).join(' ') ?? '',
        avatar: profile.avatar_url,
      },
      ipAddress,
    );
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
