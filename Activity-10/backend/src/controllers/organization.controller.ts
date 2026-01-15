import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  IsString,
  IsOptional,
  MinLength,
  IsUrl,
  IsEmail,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { OrganizationService } from '../services/organization.service';
import { OrganizationStatus } from '../entities/organization.entity';

// TODO: Create auth guard for admin verification
// @UseGuards(JwtAuthGuard, AdminGuard)

class CreateOrganizationDto {
  @ApiProperty({
    description: 'Organization name',
    example: 'Tech Corp Inc.',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'Organization description',
    example: 'A leading technology company...',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Organization website',
    example: 'https://techcorp.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'Organization email',
    example: 'contact@techcorp.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Organization phone',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Organization address',
    example: '123 Main St, City, Country',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Organization logo URL or base64',
    example: 'https://example.com/logo.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    description: 'User ID (for admin operations)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  userId?: number;
}

class UpdateOrganizationDto {
  @ApiProperty({
    description: 'Organization name',
    example: 'Tech Corp Inc.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiProperty({
    description: 'Organization description',
    example: 'A leading technology company...',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Organization website',
    example: 'https://techcorp.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'Organization email',
    example: 'contact@techcorp.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Organization phone',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Organization address',
    example: '123 Main St, City, Country',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Organization logo URL or base64',
    example: 'https://example.com/logo.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    description: 'User ID (for admin operations)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  userId?: number;
}

class VerifyOrganizationDto {
  @ApiProperty({
    description: 'Whether to approve the organization',
    example: true,
  })
  @IsBoolean()
  approved: boolean;

  @ApiProperty({
    description: 'Rejection reason (required if approved is false)',
    example: 'Incomplete information',
    required: false,
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new organization (pending verification)' })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully (pending admin verification)',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data or organization name exists',
  })
  async createOrganization(@Body() dto: CreateOrganizationDto, @Req() req: Request) {
    try {
      // Use provided userId from DTO if available, otherwise fallback to req.user (which might be missing/mocked)
      // This allows the frontend to explicitly say "I am user X"
      const userId = dto.userId || (req as any).user?.uid || 1;

      const organization = await this.organizationService.createOrganization(
        userId,
        dto.name,
        dto.description,
        dto.website,
        dto.email,
        dto.phone,
        dto.address,
        dto.logo,
      );

      return {
        statusCode: 201,
        message: 'Organization created successfully. Pending admin verification.',
        data: organization,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create organization');
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all organizations with optional status filter (admin only)' })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'approved', 'rejected'],
    description: 'Filter organizations by status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search organizations by name or email',
  })
  @ApiResponse({
    status: 200,
    description: 'Organizations retrieved successfully',
  })
  async getAllOrganizations(
    @Query('status') status?: 'pending' | 'approved' | 'rejected',
    @Query('search') search?: string,
  ) {
    // TODO: Add admin guard
    const organizations = await this.organizationService.getAllOrganizations(
      status as OrganizationStatus | undefined,
      search,
    );

    return {
      statusCode: 200,
      message: 'Organizations retrieved successfully',
      data: organizations,
    };
  }

  @Get('pending')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all pending organizations (admin only)' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Pending organizations retrieved successfully',
  })
  async getPendingOrganizations() {
    // TODO: Add admin guard
    const organizations = await this.organizationService.getPendingOrganizations();

    return {
      statusCode: 200,
      message: 'Pending organizations retrieved successfully',
      data: organizations,
    };
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get organizations for a specific user' })
  @ApiResponse({
    status: 200,
    description: 'User organizations retrieved successfully',
  })
  async getUserOrganizations(@Param('userId', ParseIntPipe) userId: number) {
    const organizations = await this.organizationService.getUserOrganizations(userId);

    return {
      statusCode: 200,
      message: 'Organizations retrieved successfully',
      data: organizations,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiResponse({
    status: 200,
    description: 'Organization retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async getOrganizationById(@Param('id', ParseIntPipe) id: number) {
    const organization = await this.organizationService.getOrganizationById(id);

    return {
      statusCode: 200,
      message: 'Organization retrieved successfully',
      data: organization,
    };
  }

  @Patch(':id/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify/approve or reject an organization (admin only)' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Organization verification updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async verifyOrganization(
    @Param('id', ParseIntPipe) organizationId: number,
    @Body() dto: VerifyOrganizationDto,
    @Req() req: Request,
  ) {
    // TODO: Get adminId from authenticated admin user
    const adminId = (req as any).user?.uid || 1; // Placeholder

    const organization = await this.organizationService.verifyOrganization(
      organizationId,
      adminId,
      dto.approved,
      dto.rejectionReason,
    );

    return {
      statusCode: 200,
      message: dto.approved
        ? 'Organization approved successfully'
        : 'Organization rejected',
      data: organization,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update organization (admin only)' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async updateOrganization(
    @Param('id', ParseIntPipe) organizationId: number,
    @Body() dto: UpdateOrganizationDto,
    @Req() req: Request,
  ) {
    // Get userId from body or from authenticated user (fallback to 1)
    const userId = dto.userId || (req as any).user?.uid || 1;
    
    console.log('Update organization request:', {
      organizationId,
      userId,
      dto
    });
    
    // Remove userId from dto before passing to service
    const { userId: _, ...updateDto } = dto;

    const organization = await this.organizationService.updateOrganization(
      organizationId,
      userId,
      updateDto,
    );

    return {
      statusCode: 200,
      message: 'Organization updated successfully',
      data: organization,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an organization (admin only)' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Organization deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async deleteOrganization(@Param('id', ParseIntPipe) organizationId: number) {
    await this.organizationService.deleteOrganization(organizationId);

    return {
      statusCode: 200,
      message: 'Organization deleted successfully',
    };
  }
}

