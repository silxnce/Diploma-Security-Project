import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserType,
} from '../common/decorators/current-user.decorator';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Post('register')
  @ApiOperation({ summary: 'Створити акаунт' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.captchaToken);
  }

  @UseGuards(ThrottlerGuard)
  @Post('login')
  @ApiOperation({ summary: 'Увійти в акаунт' })
  login(@Body() dto: LoginDto, @Req() request: Request) {
    return this.authService.login(
      dto.email,
      dto.password,
      dto.captchaToken,
      request.ip || 'unknown',
      request.headers['user-agent'],
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Отримати інформацію акаунта' })
  getProfile(@CurrentUser() user: CurrentUserType) {
    return user;
  }
}
