import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class ChangeRoleDto {
  @IsEnum(UserRole)
  @ApiProperty({
    name: 'role',
    required: true,
    description: 'Роль користувача',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role!: UserRole;
}
