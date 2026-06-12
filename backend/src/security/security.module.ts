import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SecurityService } from './security.service';
import { SecurityEvent } from './entities/security-event.entity';

import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { SuspiciousRequestMiddleware } from './middleware/suspicious-request.middleware';
import { SecurityController } from './security.controller';
import { AdminAccessMiddleware } from './middleware/admin-access.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([SecurityEvent])],
  providers: [SecurityService],
  exports: [SecurityService],
  controllers: [SecurityController],
})
export class SecurityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware, SuspiciousRequestMiddleware)
      .forRoutes('*');

    consumer.apply(AdminAccessMiddleware).forRoutes('users', 'security/events');
  }
}
