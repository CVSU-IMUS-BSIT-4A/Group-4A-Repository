import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  IsString,
  IsNumber,
  IsOptional,
  MinLength,
  IsDateString,
  Min,
} from 'class-validator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
  ApiQuery,
} from '@nestjs/swagger';
import { EventService } from '../services/event.service';
import { EventStatus } from '../entities/event.entity';

export class CreateEventDto {
  @ApiProperty({
    description:
      'ID of the user organizing the event (required if organizationId is not provided)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  organizerId?: number;

  @ApiProperty({
    description:
      'ID of the organization organizing the event (required if organizerId is not provided)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  organizationId?: number;

  @ApiProperty({
    description: 'Event title',
    example: 'Tech Conference 2026',
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: 'Event description',
    example: 'Annual technology conference featuring the latest innovations.',
  })
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty({
    description: 'Date of the event in ISO format',
    example: '2026-02-15',
  })
  @IsDateString()
  eventDate: string;

  @ApiProperty({
    description: 'Start time of the event in 24-hour format (HH:MM)',
    example: '09:00',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'End time of the event in 24-hour format (HH:MM)',
    example: '17:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({
    description: 'Event location',
    example: 'Manila Convention Center',
  })
  @IsString()
  @MinLength(1)
  location: string;

  @ApiProperty({
    description: 'Event category',
    example: 'Technology',
  })
  @IsString()
  @MinLength(1)
  category: string;

  @ApiProperty({
    description: 'Event image URL',
    example: 'https://example.com/event-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Maximum number of attendees',
    example: 500,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxAttendees?: number;
}

export class UpdateEventDto {
  @ApiProperty({
    description: 'ID of the user organizing the event',
    example: 1,
  })
  @IsNumber()
  organizerId: number;

  @ApiProperty({
    description: 'Event title',
    example: 'Tech Conference 2026',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiProperty({
    description: 'Event description',
    example: 'Annual technology conference featuring the latest innovations.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;

  @ApiProperty({
    description: 'Date of the event in ISO format',
    example: '2026-02-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @ApiProperty({
    description: 'Start time of the event in 24-hour format (HH:MM)',
    example: '09:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({
    description: 'End time of the event in 24-hour format (HH:MM)',
    example: '17:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({
    description: 'Event location',
    example: 'Manila Convention Center',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  location?: string;

  @ApiProperty({
    description: 'Event category',
    example: 'Technology',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  category?: string;

  @ApiProperty({
    description: 'Event image URL or base64 data URL',
    example: 'https://example.com/event-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Maximum number of attendees',
    example: 500,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxAttendees?: number;
}

export class JoinEventDto {
  @ApiProperty({
    description: 'ID of the user joining/leaving the event',
    example: 1,
  })
  @IsNumber()
  userId: number;
}

export class VerifyAttendeeDto {
  @ApiProperty({
    description: 'Ticket code from the QR code',
    example: 'TKT-5-54AFD157',
  })
  @IsString()
  @MinLength(1)
  ticketCode: string;
}

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data',
  })
  async createEvent(@Body() dto: CreateEventDto) {
    try {
      const event = await this.eventService.createEvent(
        dto.organizerId,
        dto.organizationId,
        dto.title,
        dto.description,
        new Date(dto.eventDate),
        dto.startTime,
        dto.location,
        dto.category,
        dto.endTime,
        dto.image,
        dto.maxAttendees,
      );

      return {
        statusCode: 201,
        message: 'Event created successfully',
        data: event,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create event');
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing event' })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data or permission denied',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
  })
  async updateEvent(
    @Param('id', ParseIntPipe) eventId: number,
    @Body() dto: UpdateEventDto,
  ) {
    try {
      const event = await this.eventService.updateEvent(
        eventId,
        dto.organizerId,
        dto.title,
        dto.description,
        dto.eventDate ? new Date(dto.eventDate) : undefined,
        dto.startTime,
        dto.endTime,
        dto.location,
        dto.category,
        dto.image,
        dto.maxAttendees,
      );

      return {
        statusCode: 200,
        message: 'Event updated successfully',
        data: event,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update event');
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all events with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: EventStatus })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
  })
  async getAllEvents(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: EventStatus,
  ) {
    const result = await this.eventService.getAllEvents(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      status,
    );

    return {
      statusCode: 200,
      message: 'Events retrieved successfully',
      ...result,
    };
  }

  // Note: This route must come BEFORE /:id to avoid "user" being parsed as an id
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get events for a specific user' })
  @ApiQuery({ name: 'type', required: false, enum: ['joined', 'organized'] })
  @ApiQuery({ name: 'status', required: false, enum: EventStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'User events retrieved successfully',
  })
  async getUserEvents(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: Request,
    @Query('type') type: 'joined' | 'organized' = 'joined',
    @Query('status') status?: EventStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // Get request origin for mobile access
    const origin =
      req.headers.origin ||
      req.headers.referer ||
      `${req.protocol}://${req.get('host')}`;
    const result = await this.eventService.getUserEvents(
      userId,
      type,
      status,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      origin,
    );

    return {
      statusCode: 200,
      message: 'User events retrieved successfully',
      ...result,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({
    status: 200,
    description: 'Event retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
  })
  async getEventById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    try {
      // Get request origin for mobile access
      const origin =
        req.headers.origin ||
        req.headers.referer ||
        `${req.protocol}://${req.get('host')}`;
      const event = await this.eventService.getEventById(id, origin);

      return {
        statusCode: 200,
        message: 'Event retrieved successfully',
        data: event,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Event not found');
    }
  }

  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join an event' })
  @ApiResponse({
    status: 200,
    description: 'Successfully joined the event',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Cannot join event',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Already joined this event',
  })
  async joinEvent(
    @Param('id', ParseIntPipe) eventId: number,
    @Body() dto: JoinEventDto,
  ) {
    try {
      const result = await this.eventService.joinEvent(eventId, dto.userId);

      return {
        statusCode: 200,
        ...result,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to join event');
    }
  }

  @Post(':id/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave an event' })
  @ApiResponse({
    status: 200,
    description: 'Successfully left the event',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Cannot leave event',
  })
  @ApiResponse({
    status: 404,
    description: 'Not registered for this event',
  })
  async leaveEvent(
    @Param('id', ParseIntPipe) eventId: number,
    @Body() dto: JoinEventDto,
  ) {
    try {
      const result = await this.eventService.leaveEvent(eventId, dto.userId);

      return {
        statusCode: 200,
        ...result,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to leave event');
    }
  }

  @Get(':id/ticket/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user ticket for an event' })
  @ApiResponse({
    status: 200,
    description: 'Ticket retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket not found',
  })
  async getUserTicket(
    @Param('id', ParseIntPipe) eventId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    try {
      const ticket = await this.eventService.getUserTicket(eventId, userId);

      return {
        statusCode: 200,
        message: 'Ticket retrieved successfully',
        data: ticket,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new NotFoundException('Ticket not found');
    }
  }

  @Get('tickets/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tickets for a user' })
  @ApiResponse({
    status: 200,
    description: 'Tickets retrieved successfully',
  })
  async getUserTickets(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: Request,
  ) {
    try {
      // Get request origin for mobile access
      const origin =
        req.headers.origin ||
        req.headers.referer ||
        `${req.protocol}://${req.get('host')}`;
      const tickets = await this.eventService.getUserTickets(userId, origin);

      return {
        statusCode: 200,
        message: 'Tickets retrieved successfully',
        data: tickets,
      };
    } catch {
      throw new BadRequestException('Failed to retrieve tickets');
    }
  }

  @Post(':id/verify-attendee')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify an attendee by ticket code' })
  @ApiResponse({
    status: 200,
    description: 'Attendee verified successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid ticket',
  })
  async verifyAttendee(
    @Param('id', ParseIntPipe) eventId: number,
    @Body() dto: VerifyAttendeeDto,
  ) {
    try {
      const result = await this.eventService.verifyAttendee(
        eventId,
        dto.ticketCode,
      );

      return {
        statusCode: 200,
        message: 'Attendee verified successfully',
        data: result,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to verify attendee');
    }
  }

  @Post(':id/notify-attendees')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send email notification to all attendees' })
  @ApiResponse({
    status: 200,
    description: 'Email notifications sent successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
  })
  async notifyAttendees(@Param('id', ParseIntPipe) eventId: number) {
    try {
      await this.eventService.sendAttendeeNotifications(eventId);

      return {
        statusCode: 200,
        message: 'Email notifications sent successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to send email notifications');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({
    status: 200,
    description: 'Event deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Cannot delete event',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
  })
  async deleteEvent(
    @Param('id', ParseIntPipe) eventId: number,
    @Body() dto: { organizerId: number },
  ) {
    try {
      const result = await this.eventService.deleteEvent(
        eventId,
        dto.organizerId,
      );

      return {
        statusCode: 200,
        ...result,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to delete event');
    }
  }
}
