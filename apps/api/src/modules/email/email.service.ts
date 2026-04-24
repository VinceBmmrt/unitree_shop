import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly from: string;
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService) {
    this.from = config.get('EMAIL_FROM', 'Unitree Robotics <noreply@unitreerobotics.com>');
    this.apiKey = config.get('RESEND_API_KEY', '');
  }

  async send(options: SendEmailOptions): Promise<boolean> {
    if (!this.apiKey) {
      this.logger.warn(`Email skipped (no RESEND_API_KEY): ${options.subject} → ${options.to}`);
      return false;
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.from,
          to: Array.isArray(options.to) ? options.to : [options.to],
          subject: options.subject,
          html: options.html,
          reply_to: options.replyTo,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Resend API error ${res.status}: ${body}`);
      }

      this.logger.log(`Email sent: "${options.subject}" → ${options.to}`);
      return true;
    } catch (err) {
      this.logger.error(`Failed to send email: ${(err as Error).message}`);
      return false;
    }
  }
}
