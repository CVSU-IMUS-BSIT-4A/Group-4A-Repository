import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from '../entities/event.entity';
import {
  EventAttendee,
  AttendeeStatus,
} from '../entities/event-attendee.entity';
import { FileUploadUtil } from '../utils/file-upload.util';
import { TicketUtil } from '../utils/ticket.util';
import { User } from '../entities/user.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EventService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(EventAttendee)
    private attendeeRepository: Repository<EventAttendee>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private fileUploadUtil: FileUploadUtil,
    private ticketUtil: TicketUtil,
  ) {
    // Configure nodemailer transporter
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpSecure = process.env.SMTP_SECURE === 'true';

    if (smtpUser && smtpPass) {
      try {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
      } catch (error) {
        console.error('Error creating SMTP transporter:', error);
      }
    }
  }

  async createEvent(
    organizerId: number | undefined,
    organizationId: number | undefined,
    title: string,
    description: string,
    eventDate: Date,
    startTime: string,
    location: string,
    category: string,
    endTime?: string,
    image?: string,
    maxAttendees?: number,
  ) {
    console.log('[EventService] createEvent called');
    console.log(
      '[EventService] Image received:',
      image ? `${image.substring(0, 50)}...` : 'none',
    );

    // Save image to local storage if it's a base64 data URL
    let savedImagePath: string | undefined = undefined;
    if (image) {
      console.log('[EventService] Attempting to save image...');
      const savedPath = await this.fileUploadUtil.saveBase64Image(image);
      console.log('[EventService] savedPath:', savedPath);
      if (savedPath) {
        savedImagePath = savedPath;
      } else {
        // If saving failed but image exists, keep the original (might be a URL)
        savedImagePath = image;
      }
    }
    console.log('[EventService] Final savedImagePath:', savedImagePath);

    // Validate that either organizerId or organizationId is provided
    if (!organizerId && !organizationId) {
      throw new BadRequestException('Either organizerId or organizationId must be provided');
    }

    // Create event entity with conditional fields
    const eventData: Partial<Event> = {
      title,
      description,
      eventDate,
      startTime,
      endTime,
      location,
      category,
      image: savedImagePath,
      maxAttendees,
      status: EventStatus.UPCOMING,
    };

    // Only include organizerId or organizationId if they have values
    if (organizerId) {
      eventData.organizerId = organizerId;
    }
    if (organizationId) {
      eventData.organizationId = organizationId;
    }

    const event = this.eventRepository.create(eventData);

    const savedEvent = await this.eventRepository.save(event);

    return {
      id: savedEvent.id,
      title: savedEvent.title,
      description: savedEvent.description,
      eventDate: savedEvent.eventDate,
      startTime: savedEvent.startTime,
      endTime: savedEvent.endTime,
      location: savedEvent.location,
      category: savedEvent.category,
      status: savedEvent.status,
      maxAttendees: savedEvent.maxAttendees,
      image: savedEvent.image,
    };
  }

  async updateEvent(
    eventId: number,
    organizerId: number,
    title?: string,
    description?: string,
    eventDate?: Date,
    startTime?: string,
    endTime?: string,
    location?: string,
    category?: string,
    image?: string,
    maxAttendees?: number,
  ) {
    // Check if event exists and user is the organizer
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== organizerId) {
      throw new BadRequestException(
        'You do not have permission to update this event',
      );
    }

    // Check if event is completed or cancelled - should not be editable
    const currentStatus = this.calculateEventStatus(event);
    if (
      currentStatus === EventStatus.COMPLETED ||
      currentStatus === EventStatus.CANCELLED ||
      event.status === EventStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cannot update a completed or cancelled event',
      );
    }

    // Handle image update
    let savedImagePath: string | undefined = undefined;
    if (image !== undefined) {
      if (image) {
        // If image is a base64 data URL, save it
        if (image.startsWith('data:image')) {
          const savedPath = await this.fileUploadUtil.saveBase64Image(image);
          savedImagePath = savedPath || image;
        } else {
          // If it's already a URL, keep it as is
          savedImagePath = image;
        }
      } else {
        // If image is empty string, remove it
        savedImagePath = undefined;
      }
    } else {
      // If image is undefined, keep the existing one
      savedImagePath = event.image;
    }

    // Update only provided fields
    const updateData: Partial<Event> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (eventDate !== undefined) updateData.eventDate = eventDate;
    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (location !== undefined) updateData.location = location;
    if (category !== undefined) updateData.category = category;
    if (image !== undefined) updateData.image = savedImagePath;
    if (maxAttendees !== undefined) updateData.maxAttendees = maxAttendees;

    // Update event
    await this.eventRepository.update(eventId, updateData);

    // Fetch updated event
    const updatedEvent = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['organizer', 'attendees'],
    });

    if (!updatedEvent) {
      throw new NotFoundException('Event not found after update');
    }

    // Recalculate status if date/time changed
    const newStatus = this.calculateEventStatus(updatedEvent);
    if (
      newStatus !== updatedEvent.status &&
      newStatus !== EventStatus.CANCELLED
    ) {
      await this.eventRepository.update(eventId, { status: newStatus });
      updatedEvent.status = newStatus;
    }

    return {
      id: updatedEvent.id,
      title: updatedEvent.title,
      description: updatedEvent.description,
      eventDate: updatedEvent.eventDate,
      startTime: updatedEvent.startTime,
      endTime: updatedEvent.endTime,
      location: updatedEvent.location,
      category: updatedEvent.category,
      status: updatedEvent.status,
      maxAttendees: updatedEvent.maxAttendees,
      image: updatedEvent.image,
    };
  }

  async getAllEvents(
    page: number = 1,
    limit: number = 10,
    status?: EventStatus,
  ) {
    const skip = (page - 1) * limit;

    const whereClause: Record<string, unknown> = {};
    if (status) {
      whereClause.status = status;
    }

    const [events, total] = await this.eventRepository.findAndCount({
      where: whereClause,
      relations: ['organizer', 'attendees'],
      order: { eventDate: 'ASC' },
      skip,
      take: limit,
    });

    return {
      events: events.map((event) => this.formatEvent(event)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEventById(id: number, requestOrigin?: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: [
        'organizer',
        'organizer.userDetail',
        'organization',
        'attendees',
        'attendees.user',
      ],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.formatEvent(event, true, requestOrigin);
  }

  async getUserEvents(
    userId: number,
    type: 'joined' | 'organized',
    status?: EventStatus,
    page: number = 1,
    limit: number = 10,
    requestOrigin?: string,
  ) {
    const skip = (page - 1) * limit;

    if (type === 'organized') {
      const whereClause: Record<string, unknown> = { organizerId: userId };
      if (status) {
        whereClause.status = status;
      }

      const [events, total] = await this.eventRepository.findAndCount({
        where: whereClause,
        relations: ['attendees', 'organizer', 'organizer.userDetail'],
        order: { eventDate: 'DESC' },
        skip,
        take: limit,
      });

      return {
        events: events.map((event) => ({
          ...this.formatEvent(event, false, requestOrigin),
          type: 'organized',
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } else {
      // Get events the user has joined
      const queryBuilder = this.attendeeRepository
        .createQueryBuilder('attendee')
        .leftJoinAndSelect('attendee.event', 'event')
        .leftJoinAndSelect('event.attendees', 'eventAttendees')
        .leftJoinAndSelect('event.organizer', 'organizer')
        .leftJoinAndSelect('organizer.userDetail', 'organizerDetail')
        .where('attendee.userId = :userId', { userId })
        .andWhere('attendee.status != :cancelledStatus', {
          cancelledStatus: AttendeeStatus.CANCELLED,
        });

      if (status) {
        queryBuilder.andWhere('event.status = :status', { status });
      }

      const [attendees, total] = await queryBuilder
        .orderBy('event.eventDate', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        events: attendees.map((attendee) => ({
          ...this.formatEvent(attendee.event, false, requestOrigin),
          type: 'joined',
          registeredAt: attendee.registeredAt,
          attendeeStatus: attendee.status,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
  }

  async joinEvent(eventId: number, userId: number) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['attendees'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId === userId) {
      throw new BadRequestException('You cannot join your own event');
    }

    if (event.status === EventStatus.CANCELLED) {
      throw new BadRequestException('This event has been cancelled');
    }

    if (event.status === EventStatus.COMPLETED) {
      throw new BadRequestException('This event has already ended');
    }

    // Get user details for ticket
    const user = await this.userRepository.findOne({
      where: { uid: userId },
      relations: ['userDetail'],
    });

    const userName = user?.userDetail
      ? `${user.userDetail.first_name || ''} ${user.userDetail.last_name || ''}`.trim()
      : user?.email || 'Guest';

    // Check if user already registered
    const existingAttendee = await this.attendeeRepository.findOne({
      where: { eventId, userId },
    });

    if (existingAttendee) {
      if (existingAttendee.status === AttendeeStatus.CANCELLED) {
        // Re-register - generate new ticket if needed
        existingAttendee.status = AttendeeStatus.REGISTERED;

        if (!existingAttendee.ticketCode || !existingAttendee.qrCode) {
          const ticketCode = this.ticketUtil.generateTicketCode(
            eventId,
            userId,
          );
          const qrCode = await this.ticketUtil.generateQRCode({
            ticketCode,
            eventId,
            eventTitle: event.title,
            userId,
            userName,
            eventDate: event.eventDate,
            eventTime: event.startTime,
            location: event.location,
          });
          existingAttendee.ticketCode = ticketCode;
          existingAttendee.qrCode = qrCode;
        }

        await this.attendeeRepository.save(existingAttendee);

        // Send confirmation email for re-joining
        await this.sendJoinConfirmationEmail(user, event, existingAttendee.ticketCode);

        return {
          message: 'Successfully re-joined the event',
          ticket: {
            ticketCode: existingAttendee.ticketCode || '',
            qrCode: existingAttendee.qrCode || '',
          },
        };
      }
      throw new ConflictException('You have already joined this event');
    }

    // Check max attendees
    if (event.maxAttendees) {
      const currentAttendees = event.attendees.filter(
        (a) => a.status !== AttendeeStatus.CANCELLED,
      ).length;
      if (currentAttendees >= event.maxAttendees) {
        throw new BadRequestException('This event is full');
      }
    }

    // Generate ticket
    const ticketCode = this.ticketUtil.generateTicketCode(eventId, userId);
    const qrCode = await this.ticketUtil.generateQRCode({
      ticketCode,
      eventId,
      eventTitle: event.title,
      userId,
      userName,
      eventDate: event.eventDate,
      eventTime: event.startTime,
      location: event.location,
    });

    const attendee = this.attendeeRepository.create({
      eventId,
      userId,
      status: AttendeeStatus.REGISTERED,
      ticketCode,
      qrCode,
    });

    await this.attendeeRepository.save(attendee);

    // Send confirmation email
    await this.sendJoinConfirmationEmail(user, event, ticketCode);

    return {
      message: 'Successfully joined the event',
      ticket: {
        ticketCode,
        qrCode,
      },
    };
  }

  async leaveEvent(eventId: number, userId: number) {
    const attendee = await this.attendeeRepository.findOne({
      where: { eventId, userId },
    });

    if (!attendee) {
      throw new NotFoundException('You are not registered for this event');
    }

    if (attendee.status === AttendeeStatus.CANCELLED) {
      throw new BadRequestException('You have already left this event');
    }

    attendee.status = AttendeeStatus.CANCELLED;
    await this.attendeeRepository.save(attendee);

    return { message: 'Successfully left the event' };
  }

  async deleteEvent(eventId: number, organizerId: number) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== organizerId) {
      throw new BadRequestException('You can only delete your own events');
    }

    await this.eventRepository.remove(event);

    return { message: 'Event deleted successfully' };
  }

  async getUserTicket(eventId: number, userId: number) {
    const attendee = await this.attendeeRepository.findOne({
      where: { eventId, userId },
      relations: ['event'],
    });

    if (!attendee) {
      throw new NotFoundException('You are not registered for this event');
    }

    if (attendee.status === AttendeeStatus.CANCELLED) {
      throw new BadRequestException(
        'Your registration has been cancelled for this event',
      );
    }

    if (!attendee.ticketCode || !attendee.qrCode) {
      throw new NotFoundException('Ticket not found for this registration');
    }

    // Check if event is completed - tickets should not be viewable after event ends
    const eventStatus = this.calculateEventStatus(attendee.event);
    if (eventStatus === EventStatus.COMPLETED) {
      throw new NotFoundException(
        'This event has completed. Tickets are no longer available.',
      );
    }

    return {
      ticketCode: attendee.ticketCode,
      qrCode: attendee.qrCode,
      eventTitle: attendee.event.title,
      eventDate: attendee.event.eventDate,
      eventTime: attendee.event.startTime,
      location: attendee.event.location,
      status: attendee.status,
      registeredAt: attendee.registeredAt,
    };
  }

  async getUserTickets(userId: number, requestOrigin?: string) {
    const attendees = await this.attendeeRepository.find({
      where: [
        { userId, status: AttendeeStatus.REGISTERED },
        { userId, status: AttendeeStatus.CONFIRMED },
      ],
      relations: ['event'],
      order: { registeredAt: 'DESC' },
    });

    // Use request origin if available (for mobile access), otherwise fallback to env or localhost
    let baseUrl = 'http://localhost:3005';
    if (requestOrigin) {
      try {
        const url = new URL(requestOrigin);
        baseUrl = `${url.protocol}//${url.hostname}:3005`;
      } catch {
        baseUrl = requestOrigin.replace(/:\d+$/, ':3005');
      }
    } else {
      baseUrl = process.env.API_BASE_URL || 'http://localhost:3005';
    }

    return attendees
      .filter((a) => {
        // Filter out attendees without tickets
        if (!a.ticketCode || !a.qrCode) {
          return false;
        }

        // Filter out tickets from completed events - tickets should only be visible until event ends
        const eventStatus = this.calculateEventStatus(a.event);
        return eventStatus !== EventStatus.COMPLETED;
      })
      .map((attendee) => {
        // Format image URL
        let imageUrl = attendee.event.image;
        if (
          imageUrl &&
          !imageUrl.startsWith('http') &&
          !imageUrl.startsWith('data:')
        ) {
          imageUrl = `${baseUrl}/uploads/${imageUrl}`;
        }

        // Calculate current status
        const currentStatus = this.calculateEventStatus(attendee.event);

        // Update database status if it has changed (except for cancelled events)
        if (
          currentStatus !== attendee.event.status &&
          attendee.event.status !== EventStatus.CANCELLED
        ) {
          this.eventRepository
            .update(attendee.eventId, { status: currentStatus })
            .catch((err) => {
              console.error('Failed to update event status:', err);
            });
        }

        return {
          eventId: attendee.eventId,
          ticketCode: attendee.ticketCode || '',
          qrCode: attendee.qrCode || '',
          eventTitle: attendee.event.title,
          eventDescription: attendee.event.description,
          eventDate: attendee.event.eventDate,
          eventTime: attendee.event.startTime,
          endTime: attendee.event.endTime,
          location: attendee.event.location,
          category: attendee.event.category,
          image: imageUrl,
          status: currentStatus, // Use calculated status
          registeredAt: attendee.registeredAt,
        };
      });
  }

  async verifyAttendee(eventId: number, ticketCode: string) {
    // Find the attendee by ticket code
    const attendee = await this.attendeeRepository.findOne({
      where: { ticketCode, eventId },
      relations: ['user', 'event'],
    });

    if (!attendee) {
      throw new NotFoundException('Ticket not found or invalid');
    }

    // Check if the attendee belongs to the event
    if (attendee.eventId !== eventId) {
      throw new BadRequestException('Ticket does not belong to this event');
    }

    // Check if attendee is cancelled
    if (attendee.status === AttendeeStatus.CANCELLED) {
      throw new BadRequestException('This ticket has been cancelled');
    }

    // Check if event is available
    if (!attendee.event) {
      throw new BadRequestException('Event information not available');
    }

    // Only allow verification when event is ONGOING
    const eventStatus = this.calculateEventStatus(attendee.event);
    if (eventStatus !== EventStatus.ONGOING) {
      if (eventStatus === EventStatus.COMPLETED) {
        throw new BadRequestException(
          'This event has already completed. QR code verification is only allowed during the event.',
        );
      }
      if (eventStatus === EventStatus.CANCELLED) {
        throw new BadRequestException(
          'This event has been cancelled. QR code is no longer valid.',
        );
      }
      if (eventStatus === EventStatus.UPCOMING) {
        throw new BadRequestException(
          'This event has not started yet. QR code verification is only allowed during the event.',
        );
      }
      throw new BadRequestException(
        'QR code verification is only allowed when the event is ongoing.',
      );
    }

    // Update status to confirmed if not already
    if (attendee.status === AttendeeStatus.REGISTERED) {
      attendee.status = AttendeeStatus.CONFIRMED;
      await this.attendeeRepository.save(attendee);
    }

    return {
      attendee: {
        id: attendee.id,
        userId: attendee.userId,
        status: attendee.status,
        registeredAt: attendee.registeredAt,
        user: attendee.user
          ? {
              email: attendee.user.email,
            }
          : null,
      },
    };
  }

  /**
   * Calculate event status based on current date/time
   */
  private calculateEventStatus(event: Event): EventStatus {
    // If manually cancelled, keep it cancelled
    if (event.status === EventStatus.CANCELLED) {
      return EventStatus.CANCELLED;
    }

    const now = new Date();
    const eventDate = new Date(event.eventDate);

    // Parse start time (format: "HH:MM" or "HH:MM:SS")
    const [startHours, startMinutes] = event.startTime.split(':').map(Number);
    const startDateTime = new Date(eventDate);
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    // Parse end time if available, otherwise assume 2 hours duration
    let endDateTime: Date;
    if (event.endTime) {
      const [endHours, endMinutes] = event.endTime.split(':').map(Number);
      endDateTime = new Date(eventDate);
      endDateTime.setHours(endHours, endMinutes, 0, 0);
    } else {
      // Default to 2 hours after start time
      endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 2);
    }

    // Compare with current time
    if (now < startDateTime) {
      return EventStatus.UPCOMING;
    } else if (now >= startDateTime && now < endDateTime) {
      return EventStatus.ONGOING;
    } else {
      return EventStatus.COMPLETED;
    }
  }

  private formatEvent(
    event: Event,
    includeAttendees: boolean = false,
    requestOrigin?: string,
  ) {
    const attendeeCount =
      event.attendees?.filter((a) => a.status !== AttendeeStatus.CANCELLED)
        .length || 0;

    // Convert local image path to full URL
    let imageUrl = event.image;
    if (
      imageUrl &&
      !imageUrl.startsWith('http') &&
      !imageUrl.startsWith('data:')
    ) {
      // It's a local file path, convert to URL
      // Use request origin if available (for mobile access), otherwise fallback to env or localhost
      let baseUrl = 'http://localhost:3005';
      if (requestOrigin) {
        // Extract hostname and port from origin, or use origin directly
        try {
          const url = new URL(requestOrigin);
          baseUrl = `${url.protocol}//${url.hostname}:3005`;
        } catch {
          // If parsing fails, try to use requestOrigin as base
          baseUrl = requestOrigin.replace(/:\d+$/, ':3005');
        }
      } else {
        baseUrl = process.env.API_BASE_URL || 'http://localhost:3005';
      }
      imageUrl = `${baseUrl}/uploads/${imageUrl}`;
    }

    // Get organizer name from organization or user details
    let organizerName = 'Unknown Organizer';
    if (event.organization) {
      // If event has an organization, use organization name
      organizerName = event.organization.name;
    } else if (event.organizer) {
      // Otherwise, use user's name
      const userDetail = event.organizer.userDetail;
      if (userDetail) {
        const firstName = userDetail.first_name || '';
        const lastName = userDetail.last_name || '';
        organizerName =
          `${firstName} ${lastName}`.trim() || event.organizer.email;
      } else {
        organizerName = event.organizer.email;
      }
    }

    // Calculate current status based on date/time
    const currentStatus = this.calculateEventStatus(event);

    // Update database status if it has changed (except for cancelled events)
    if (
      currentStatus !== event.status &&
      event.status !== EventStatus.CANCELLED
    ) {
      // Update in background (don't await to avoid blocking)
      this.eventRepository
        .update(event.id, { status: currentStatus })
        .catch((err) => {
          console.error('Failed to update event status:', err);
        });
    }

    const result: Record<string, unknown> = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.eventDate,
      time: event.startTime,
      endTime: event.endTime,
      location: event.location,
      image: imageUrl,
      status: currentStatus, // Use calculated status
      category: event.category,
      attendees: attendeeCount,
      maxAttendees: event.maxAttendees,
      organizerId: event.organizerId,
      organizerName,
      organizerEmail: event.organizer?.email,
      organizationId: event.organizationId,
      organizationName: event.organization?.name,
      organizationLogo: event.organization?.logo,
      createdAt: event.createdAt,
    };

    if (includeAttendees && event.attendees) {
      result.attendeeList = event.attendees
        .filter((a) => a.status !== AttendeeStatus.CANCELLED)
        .map((a) => ({
          id: a.id,
          userId: a.userId,
          status: a.status,
          registeredAt: a.registeredAt,
          user: a.user
            ? {
                email: a.user.email,
              }
            : null,
        }));
    }

    return result;
  }

  async sendAttendeeNotifications(eventId: number) {
    // Get event with attendees
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['attendees', 'attendees.user', 'organization'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!this.transporter) {
      throw new BadRequestException('Email service is not configured');
    }

    // Get all registered or confirmed attendees
    const attendees = event.attendees?.filter(
      (a) => a.status === AttendeeStatus.REGISTERED || a.status === AttendeeStatus.CONFIRMED,
    );

    if (!attendees || attendees.length === 0) {
      throw new BadRequestException('No attendees to notify');
    }

    const eventDate = new Date(event.eventDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const organizerName = event.organization?.name || 'Event Organizer';

    // Send email to each attendee
    const emailPromises = attendees.map(async (attendee) => {
      if (!attendee.user?.email) return;

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: attendee.user.email,
        subject: `Event Reminder: ${event.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Event Reminder</h2>
            <p>Hi there,</p>
            <p>This is a reminder that you're registered for the following event:</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">${event.title}</h3>
              <p style="color: #666; margin: 10px 0;">${event.description}</p>
              
              <div style="margin-top: 15px;">
                <p style="margin: 8px 0;"><strong>Date:</strong> ${eventDate}</p>
                <p style="margin: 8px 0;"><strong>Time:</strong> ${event.startTime}${event.endTime ? ' - ' + event.endTime : ''}</p>
                <p style="margin: 8px 0;"><strong>Location:</strong> ${event.location}</p>
                <p style="margin: 8px 0;"><strong>Category:</strong> ${event.category}</p>
                <p style="margin: 8px 0;"><strong>Organized by:</strong> ${organizerName}</p>
                <p style="margin: 8px 0;"><strong>Status:</strong> ${attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}</p>
              </div>
            </div>

            <p>We look forward to seeing you at the event!</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} Occasio. All rights reserved.</p>
          </div>
        `,
      };

      try {
        if (this.transporter) {
          await this.transporter.sendMail(mailOptions);
          console.log(`Email sent to: ${attendee.user.email}`);
        } else {
          console.warn(`Skipping email to ${attendee.user.email}: Email service not configured`);
        }
      } catch (error) {
        console.error(`Failed to send email to ${attendee.user.email}:`, error);
      }
    });

    await Promise.all(emailPromises);
  }

  private async sendJoinConfirmationEmail(user: any, event: any, ticketCode: string) {
    if (!this.transporter || !user?.email) {
      console.warn('Email service not configured or user email not available');
      return;
    }

    const eventDate = new Date(event.eventDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const userName = user.userDetail
      ? `${user.userDetail.first_name || ''} ${user.userDetail.last_name || ''}`.trim()
      : 'there';

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const eventLink = `${frontendUrl}/event/${event.id}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: `Registration Confirmed: ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Registration Confirmed!</h2>
          <p>Hi ${userName},</p>
          <p>Thank you for registering for <strong>${event.title}</strong>.</p>
          <p>Your registration has been confirmed. Here are your event details:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${eventLink}" style="background-color: #171717; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: 500; display: inline-block;">
              View Event Details
            </a>
          </div>
          <p><strong>Date:</strong> ${eventDate}</p>
          <p><strong>Time:</strong> ${event.startTime}${event.endTime ? ' - ' + event.endTime : ''}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p><strong>Ticket Code:</strong> ${ticketCode}</p>
          <p>Please save your ticket code for event check-in.</p>
          <p>We look forward to seeing you at the event!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">© 2026 Occasio. All rights reserved.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Join confirmation email sent to: ${user.email}`);
    } catch (error) {
      console.error(`Failed to send join confirmation email to ${user.email}:`, error);
    }
  }
}
