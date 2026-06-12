import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeRoleDto } from './dto/change-role.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import {
  CurrentUser,
  CurrentUserType,
} from '../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  @ApiOperation({ summary: 'Оновити власний профіль користувача' })
  updateMyProfile(
    @CurrentUser() currentUser: CurrentUserType,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(currentUser.userId, dto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Отримати всіх користувачів (ADMIN only)' })
  getUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Отримати користувача за id (ADMIN only)' })
  getUser(@Param('id') id: string) {
    return this.usersService.findById(Number(id));
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Оновити інформацію користувача (ADMIN only)' })
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(Number(id), dto);
  }

  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Оновити роль користувача (ADMIN only)' })
  changeRole(
    @Param('id') id: string,
    @Body() dto: ChangeRoleDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    const targetUserId = Number(id);

    if (targetUserId === currentUser.userId) {
      throw new BadRequestException('Ви не можете змінити вашу власну роль');
    }

    return this.usersService.changeRole(targetUserId, dto.role);
  }

  @Patch(':id/block')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Заблокувати користувача (ADMIN only)' })
  block(@Param('id') id: string, @CurrentUser() currentUser: CurrentUserType) {
    const targetUserId = Number(id);

    if (targetUserId === currentUser.userId) {
      throw new BadRequestException(
        'Ви не можете заблокувати ваш власний акаунт',
      );
    }

    return this.usersService.block(targetUserId);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Активувати користувача (ADMIN only)' })
  activate(@Param('id') id: string) {
    return this.usersService.activate(Number(id));
  }
}
