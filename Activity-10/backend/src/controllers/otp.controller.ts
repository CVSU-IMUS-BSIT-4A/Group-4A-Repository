import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { IsEmail, IsString, Length, Matches } from 'class-validator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { OtpService } from '../services/otp.service';

export class SendOtpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/, { message: 'OTP code must be 6 digits' })
  code: string;
}

@ApiTags('otp')
@Controller('users')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to email address' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'OTP sent successfully to your email',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to send OTP',
    schema: {
      example: {
        statusCode: 400,
        message: 'Failed to send OTP. Please try again.',
      },
    },
  })
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    const result = await this.otpService.sendOtp(sendOtpDto.email);
    if (!result.success) {
      throw new BadRequestException(result.message);
    }
    const response: {
      statusCode: number;
      message: string;
      devMode?: boolean;
      otp?: string;
    } = {
      statusCode: 200,
      message: result.message,
    };
    // Include OTP in development mode for testing
    if ('devMode' in result && result.devMode && 'otp' in result) {
      response.devMode = true;
      response.otp = result.otp as string;
    }
    return response;
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'OTP verified successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired OTP',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid OTP code',
      },
    },
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const result = await this.otpService.verifyOtp(
      verifyOtpDto.email,
      verifyOtpDto.code,
    );
    if (!result.success) {
      throw new BadRequestException(result.message);
    }
    return {
      statusCode: 200,
      message: result.message,
    };
  }
}
