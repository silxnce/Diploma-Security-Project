import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    name: 'email',
    required: true,
    description: 'Пошта користувача',
    type: String,
  })
  email!: string;

  @IsString()
  @IsNotEmpty()
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
    required: true,
    description: 'Пароль користувача',
    type: String,
  })
  password!: string;
}
