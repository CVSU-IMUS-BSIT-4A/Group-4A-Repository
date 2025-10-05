import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'newuser@example.com', 
    description: 'Email address for registration',
    format: 'email'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'securepass123', 
    description: 'Password for the new account',
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
