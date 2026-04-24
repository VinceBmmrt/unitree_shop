import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get('GITHUB_CLIENT_ID', 'disabled'),
      clientSecret: config.get('GITHUB_CLIENT_SECRET', 'disabled'),
      callbackURL: `${config.get('API_URL', 'http://localhost:3001')}/api/v1/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any) => void,
  ) {
    const primaryEmail =
      profile.emails?.find((e: any) => e.primary)?.value ||
      profile.emails?.[0]?.value;

    done(null, {
      providerId: profile.id,
      email: primaryEmail,
      firstName: profile.displayName?.split(' ')[0] || profile.username,
      lastName: profile.displayName?.split(' ').slice(1).join(' ') || '',
      avatar: profile.photos?.[0]?.value,
    });
  }
}
