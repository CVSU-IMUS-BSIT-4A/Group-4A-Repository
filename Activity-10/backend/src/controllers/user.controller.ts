import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsIn,
  Matches,
} from 'class-validator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePass123!',
  })
  @IsString()
  @MinLength(1)
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

export class VerifyResetTokenDto {
  @ApiProperty({
    description: 'Password reset token',
    example: 'a1b2c3d4e5f6...',
  })
  @IsString()
  token: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token',
    example: 'a1b2c3d4e5f6...',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'New password (minimum 8 characters)',
    example: 'NewSecurePass123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @MinLength(1)
  first_name: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @MinLength(1)
  last_name: string;

  @ApiProperty({
    description: 'User gender',
    example: 'male',
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['male', 'female', 'other', 'prefer-not-to-say'])
  gender?: string;

  @ApiProperty({
    description: 'Date of birth in YYYY-MM-DD format',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date of birth must be in YYYY-MM-DD format',
  })
  dob?: string;
}

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({
    description: 'User role',
    example: 'user',
    enum: ['user', 'admin'],
  })
  @IsString()
  @IsIn(['user', 'admin'])
  role: string;

  @ApiProperty({
    description: 'User gender',
    example: 'Male',
    required: false,
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({
    description: 'Date of birth in YYYY-MM-DD format',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date of birth must be in YYYY-MM-DD format',
  })
  birthdate?: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'SecurePass123!',
    minLength: 8,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'User role',
    example: 'user',
    enum: ['user', 'admin'],
    required: false,
  })
  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: string;

  @ApiProperty({
    description: 'Gender',
    example: 'male',
    required: false,
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({
    description: 'Date of birth (YYYY-MM-DD)',
    example: '1990-01-15',
    required: false,
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  birthdate?: string;
}

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent',
    schema: {
      example: {
        statusCode: 200,
        message: 'Password reset link sent to your email',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - User not found',
    schema: {
      example: {
        statusCode: 400,
        message: 'No account found with this email address',
      },
    },
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      await this.userService.forgotPassword(forgotPasswordDto.email);

      return {
        statusCode: 200,
        message: 'Password reset link sent to your email',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to send password reset email');
    }
  }

  @Post('verify-reset-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify password reset token' })
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
    schema: {
      example: {
        statusCode: 200,
        valid: true,
        email: 'user@example.com',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid or expired reset token',
      },
    },
  })
  async verifyResetToken(@Body() verifyResetTokenDto: VerifyResetTokenDto) {
    try {
      const result = await this.userService.verifyResetToken(
        verifyResetTokenDto.token,
      );

      return {
        statusCode: 200,
        valid: result.valid,
        email: result.email,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  @Patch('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    schema: {
      example: {
        statusCode: 200,
        message: 'Password reset successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid token or password',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid or expired reset token',
      },
    },
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      await this.userService.resetPassword(
        resetPasswordDto.token,
        resetPasswordDto.newPassword,
      );

      return {
        statusCode: 200,
        message: 'Password reset successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to reset password');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        statusCode: 200,
        message: 'Login successful',
        data: {
          uid: 1,
          email: 'user@example.com',
          role: 'user',
          first_name: 'John',
          last_name: 'Doe',
          gender: 'male',
          dob: '1990-01-01',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid email or password',
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.userService.login(
        loginDto.email,
        loginDto.password,
      );

      return {
        statusCode: 200,
        message: 'Login successful',
        data: user,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'User registered successfully',
        data: {
          uid: 1,
          email: 'user@example.com',
          role: 'user',
          first_name: 'John',
          last_name: 'Doe',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data or OTP not verified',
    schema: {
      example: {
        statusCode: 400,
        message: 'Please verify your email with OTP first.',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'User with this email already exists',
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.userService.register(
        registerDto.email,
        registerDto.password,
        registerDto.first_name,
        registerDto.last_name,
        registerDto.gender,
        registerDto.dob,
      );

      return {
        statusCode: 201,
        message: 'User registered successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Registration failed');
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  async getAllUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('isActive') isActive?: string,
  ) {
    try {
      const isActiveBool = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
      const users = await this.userService.getAllUsers(search, role, isActiveBool);

      return {
        statusCode: 200,
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      console.error('Error in getAllUsers controller:', error);
      throw error;
    }
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'User created successfully',
        data: {
          uid: 1,
          email: 'user@example.com',
          role: 'user',
          first_name: 'John',
          last_name: 'Doe',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User already exists',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.createUserByAdmin(
        createUserDto.email,
        createUserDto.password,
        createUserDto.firstName,
        createUserDto.lastName,
        createUserDto.role as any,
        createUserDto.gender,
        createUserDto.birthdate,
      );

      return {
        statusCode: 201,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  @Patch(':uid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email already exists',
  })
  async updateUser(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.updateUser(
        Number(uid),
        updateUserDto.email,
        updateUserDto.password,
        updateUserDto.firstName,
        updateUserDto.lastName,
        updateUserDto.role as any,
        updateUserDto.gender,
        updateUserDto.birthdate,
      );

      return {
        statusCode: 200,
        message: 'User updated successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  @Patch(':uid/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive a user' })
  @ApiResponse({
    status: 200,
    description: 'User archived successfully',
  })
  async archiveUser(@Param('uid') uid: string) {
    try {
      const result = await this.userService.archiveUser(Number(uid));
      return {
        statusCode: 200,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to archive user');
    }
  }

  @Patch(':uid/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived user' })
  @ApiResponse({
    status: 200,
    description: 'User restored successfully',
  })
  async restoreUser(@Param('uid') uid: string) {
    try {
      const result = await this.userService.restoreUser(Number(uid));
      return {
        statusCode: 200,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to restore user');
    }
  }
}
