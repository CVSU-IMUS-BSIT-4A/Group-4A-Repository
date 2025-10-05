import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'user@example.com', 
    description: 'User email address for login',
    format: 'email'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123', 
    description: 'User password',
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
