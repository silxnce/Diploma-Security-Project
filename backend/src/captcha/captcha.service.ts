import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type TurnstileResponse = {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
};

@Injectable()
export class CaptchaService {
  constructor(private readonly configService: ConfigService) {}

  private readonly verifyUrl =
    'https://challenges.cloudflare.com/turnstile/v0/siteverify';

  async verifyToken(token: string): Promise<boolean> {
    if (!token) {
      throw new BadRequestException('Потрібен CAPTCHA токен.');
    }

    const secretKey = this.configService.get<string>('TURNSTILE_SECRET_KEY');

    if (!secretKey) {
      throw new InternalServerErrorException(
        'TURNSTILE_SECRET_KEY не вказано.',
      );
    }

    try {
      const response = await fetch(this.verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      });

      const data = (await response.json()) as TurnstileResponse;

      if (!data.success) {
        throw new BadRequestException('Неправильний CAPTCHA токен');
      }

      return true;
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Невдала верифікація CAPTCHA');
    }
  }
}
