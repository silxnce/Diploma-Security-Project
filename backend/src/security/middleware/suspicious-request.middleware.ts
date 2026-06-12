import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { SecurityService } from '../security.service';

@Injectable()
export class SuspiciousRequestMiddleware implements NestMiddleware {
  constructor(private readonly securityService: SecurityService) {}

  async use(
    request: Request,
    _response: Response,
    next: NextFunction,
  ): Promise<void> {
    const body = { ...request.body };

    if (body.password) {
      body.password = '***';
    }

    const payload = JSON.stringify({
      body,
      query: request.query,
      params: request.params,
    });

    const suspiciousPatterns = [
      /<script/i,
      /<\/script>/i,
      /javascript:/i,
      /onerror=/i,
      /onload=/i,
      /union\s+select/i,
      /drop\s+table/i,
      /or\s+1=1/i,
      /--/i,
    ];

    const isSuspicious = suspiciousPatterns.some((pattern) =>
      pattern.test(payload),
    );

    if (isSuspicious) {
      await this.securityService.logSuspiciousRequest({
        ip: request.ip || 'unknown',
        method: request.method,
        url: request.originalUrl,
        userAgent: request.headers['user-agent'],
        payload,
      });

      throw new ForbiddenException('Заблоковано підозрілий запит.');
    }

    next();
  }
}
