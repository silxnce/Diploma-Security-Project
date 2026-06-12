import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { SecurityService } from '../security.service';

@Injectable()
export class AdminAccessMiddleware implements NestMiddleware {
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

    await this.securityService.logAdminAccess({
      ip: request.ip || 'unknown',
      method: request.method,
      url: request.originalUrl,
      userAgent: request.headers['user-agent'],
      payload,
    });

    next();
  }
}
