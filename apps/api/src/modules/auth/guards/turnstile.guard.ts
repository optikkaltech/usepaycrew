import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TurnstileGuard implements CanActivate {
  private readonly logger = new Logger(TurnstileGuard.name);

  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secretKey = this.configService.get<string>('CLOUDFLARE_TURNSTILE_SECRET_KEY');

    // If Cloudflare Turnstile is not configured in local environment, allow request
    if (!secretKey) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token =
      request.headers['cf-turnstile-response'] ||
      request.headers['x-turnstile-token'] ||
      request.body?.turnstileToken;

    if (!token) {
      this.logger.warn(`Bot protection challenge failed: missing Turnstile token from IP ${request.ip}`);
      throw new ForbiddenException('Bot verification challenge required');
    }

    try {
      const remoteIp = request.headers['x-forwarded-for'] || request.ip;
      const formData = new URLSearchParams();
      formData.append('secret', secretKey);
      formData.append('response', String(token));
      if (remoteIp) {
        formData.append('remoteip', String(remoteIp).split(',')[0].trim());
      }

      const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const outcome = (await res.json()) as { success: boolean; 'error-codes'?: string[] };

      if (!outcome.success) {
        this.logger.warn(`Turnstile verification failed for IP ${request.ip}: ${outcome['error-codes']?.join(', ')}`);
        throw new ForbiddenException('Bot verification challenge failed');
      }

      return true;
    } catch (err: any) {
      if (err instanceof ForbiddenException) throw err;
      this.logger.error(`Turnstile verification service error: ${err.message}`);
      throw new ForbiddenException('Bot verification service unavailable');
    }
  }
}
