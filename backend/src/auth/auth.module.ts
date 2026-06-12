import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { CaptchaModule } from '../captcha/captcha.module';
import { UsersModule } from '../users/users.module';

import { JwtStrategy } from './jwt.strategy';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [
    UsersModule,
    CaptchaModule,
    PassportModule,
    SecurityModule,

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
  ],

  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
