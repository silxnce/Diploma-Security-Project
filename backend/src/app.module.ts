import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CaptchaModule } from './captcha/captcha.module';
import { DatabaseModule } from './database/database.module';
import { SecurityModule } from './security/security.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),

    UsersModule,
    AuthModule,
    CaptchaModule,
    DatabaseModule,
    SecurityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
