import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import '@fastify/cookie';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RedirectException } from '../../common/exceptions/redirect.exception';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/v1/auth',
};

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ global: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Register a new user' })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const ipAddress = req.ip;
    const { user, accessToken, refreshToken } =
      await this.authService.register(dto, ipAddress);

    res.setCookie('refresh_token', refreshToken, COOKIE_OPTIONS);
    return { user, accessToken };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ global: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Login with email/password' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.login(
      dto,
      req.ip,
      req.headers['user-agent'],
    );

    res.setCookie('refresh_token', refreshToken, COOKIE_OPTIONS);
    return { user, accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ global: { limit: 20, ttl: 60000 } })
  async refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const rawToken =
      req.cookies?.['refresh_token'] ||
      (req.body as RefreshTokenDto)?.refreshToken;

    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      rawToken ?? '',
      req.ip,
    );

    res.setCookie('refresh_token', refreshToken, COOKIE_OPTIONS);
    return { accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const rawToken = req.cookies?.['refresh_token'];
    if (rawToken) {
      await this.authService.logout(rawToken);
    }
    res.clearCookie('refresh_token', { path: '/api/v1/auth' });
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ global: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Request a password reset email' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ global: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Reset password using token from email' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password);
  }

  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  googleAuth() {
    const frontend = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    try {
      const url = this.authService.getGoogleOAuthUrl();
      throw new RedirectException(url);
    } catch (e) {
      if (e instanceof RedirectException) throw e;
      throw new RedirectException(`${frontend}/compte/connexion?error=google_not_configured`);
    }
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(
    @Query('code') code: string,
    @Query('error') _error: string,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const frontend = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    if (!code) {
      throw new RedirectException(`${frontend}/compte/connexion?error=oauth_cancelled`);
    }
    try {
      const { accessToken, refreshToken } = await this.authService.exchangeGoogleCode(code, req.ip);
      res.setCookie('refresh_token', refreshToken, COOKIE_OPTIONS);
      throw new RedirectException(`${frontend}/auth/callback#token=${accessToken}`);
    } catch (e) {
      if (e instanceof RedirectException) throw e;
      throw new RedirectException(`${frontend}/compte/connexion?error=oauth_failed`);
    }
  }

  @Get('github')
  @ApiOperation({ summary: 'Initiate GitHub OAuth flow' })
  githubAuth() {
    const frontend = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    try {
      const url = this.authService.getGitHubOAuthUrl();
      throw new RedirectException(url);
    } catch (e) {
      if (e instanceof RedirectException) throw e;
      throw new RedirectException(`${frontend}/compte/connexion?error=github_not_configured`);
    }
  }

  @Get('github/callback')
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  async githubCallback(
    @Query('code') code: string,
    @Query('error') _error: string,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const frontend = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    if (!code) {
      throw new RedirectException(`${frontend}/compte/connexion?error=oauth_cancelled`);
    }
    try {
      const { accessToken, refreshToken } = await this.authService.exchangeGitHubCode(code, req.ip);
      res.setCookie('refresh_token', refreshToken, COOKIE_OPTIONS);
      throw new RedirectException(`${frontend}/auth/callback#token=${accessToken}`);
    } catch (e) {
      if (e instanceof RedirectException) throw e;
      throw new RedirectException(`${frontend}/compte/connexion?error=oauth_failed`);
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated user' })
  getMe(@CurrentUser() user: any) {
    return user;
  }
}
