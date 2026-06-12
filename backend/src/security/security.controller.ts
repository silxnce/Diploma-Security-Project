import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SecurityService } from './security.service';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Security events (ADMIN only)')
@ApiBearerAuth('JWT-auth')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('events')
  @ApiOperation({
    summary: 'Отримати всі події безпеки',
  })
  getSecurityEvents() {
    return this.securityService.findAll();
  }

  @Get('events/:id')
  @ApiOperation({
    summary: 'Отримати подію безпеки за id',
  })
  getSecurityEventById(@Param('id') id: string) {
    return this.securityService.findById(Number(id));
  }
}
