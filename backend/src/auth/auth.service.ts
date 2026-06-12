import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { CaptchaService } from '../captcha/captcha.service';
import { SecurityService } from '../security/security.service';

import { comparePasswords, hashPassword } from '../common/utils/hash.util';

import { UserStatus } from '../common/enums/user-status.enum';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly captchaService: CaptchaService,
    private readonly jwtService: JwtService,
    private readonly securityService: SecurityService,
  ) {}

  async register(email: string, password: string, captchaToken: string) {
    await this.captchaService.verifyToken(captchaToken);

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException('Користувач вже існує');
    }

    const hashedPassword = await hashPassword(password);

    const user = await this.usersService.create(email, hashedPassword);

    return {
      message: 'Успішна реєстрація користувача',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  }

  async login(
    email: string,
    password: string,
    captchaToken: string,
    ip: string,
    userAgent?: string,
  ) {
    await this.captchaService.verifyToken(captchaToken);

    const user = await this.validateUser(email, password, ip, userAgent);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  }

  async validateUser(
    email: string,
    password: string,
    ip = 'unknown',
    userAgent?: string,
  ) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      await this.securityService.logFailedLogin(ip, email, userAgent);

      throw new UnauthorizedException('Неправильні введені дані');
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new ForbiddenException('Акаунт користувача заблоковано');
    }

    const passwordsMatch = await comparePasswords(password, user.password);

    if (!passwordsMatch) {
      await this.usersService.incrementFailedLoginAttempts(user.id);

      await this.securityService.logFailedLogin(ip, email, userAgent);

      throw new UnauthorizedException('Неправильні введені дані');
    }

    await this.usersService.markSuccessfulLogin(user.id);

    return user;
  }
}
