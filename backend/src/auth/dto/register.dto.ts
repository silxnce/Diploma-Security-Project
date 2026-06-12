import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    name: 'email',
    required: true,
    description: "User's email",
    type: String,
  })
  email!: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({
    name: 'password',
    required: true,
    description: "User's password",
    type: String,
  })
  password!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'captchaToken',
    required: true,
    description:
      'Cloudflare Turnstile token obtained from frontend CAPTCHA widget',
    type: String,
    example: '0.xxxxxxxxxxxxxxxxxxxxxxxxx',
  })
  captchaToken!: string;
}
