import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

function sanitize(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item));
  }

  if (data !== null && typeof data === 'object') {
    const result: Record<string, unknown> = {
      ...(data as Record<string, unknown>),
    };

    delete result.password;
    delete result.refreshToken;

    return result;
  }

  return data;
}

@Injectable()
export class SanitizeResponseInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(map((data: unknown) => sanitize(data)));
  }
}
