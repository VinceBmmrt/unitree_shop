import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Version,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import '@fastify/cookie';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GitHubAuthGuard } from './guards/github-auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

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

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Req() req: FastifyRequest & { user: any },
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.handleOAuthCallback(
        'GOOGLE',
        req.user,
        req.ip,
      );
    res.setCookie('refresh_token', refreshToken, COOKIE_OPTIONS);
    // Redirect to frontend with token in URL fragment (SPA picks it up, never logs it)
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback#token=${accessToken}`,
    );
  }

  @Get('github')
  @UseGuards(GitHubAuthGuard)
  @ApiOperation({ summary: 'Initiate GitHub OAuth flow' })
  githubAuth() {}

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  async githubCallback(
    @Req() req: FastifyRequest & { user: any },
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.handleOAuthCallback(
        'GITHUB',
        req.user,
        req.ip,
      );
    res.setCookie('refresh_token', refreshToken, COOKIE_OPTIONS);
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback#token=${accessToken}`,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated user' })
  getMe(@CurrentUser() user: any) {
    return user;
  }
}
