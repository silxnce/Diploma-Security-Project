import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('App')
@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(ThrottlerGuard)
  @Get('status')
  @ApiOperation({ summary: 'Перевірити статус сервера' })
  getHealth() {
    return this.appService.getStatus();
  }
}
