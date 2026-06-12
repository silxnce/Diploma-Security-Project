import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    name: 'email',
    required: false,
    description: 'Пошта користувача',
    type: String,
  })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, {
    message:
      'Пароль занадто короткий. Мінімальна довжина - $constraint1 символів.',
  })
  @MaxLength(20, {
    message:
      'Пароль занадто довгий. Максимальна довжина - $constraint1 символів.',
  })
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/, {
    message: 'Пароль має містити літери та цифри.',
  })
  @ApiProperty({
    name: 'password',
    required: false,
    description: 'Пароль користувача',
    type: String,
  })
  password?: string;
}
