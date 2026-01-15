import { getApiBaseUrl } from './api-config';

// Get API base URL dynamically (supports mobile access)
// Use a function to get fresh URL on each request
function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    return getApiBaseUrl();
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
}

export interface SendOtpResponse {
  statusCode: number;
  message: string;
}

export interface VerifyOtpResponse {
  statusCode: number;
  message: string;
}

export interface RegisterResponse {
  statusCode: number;
  message: string;
  data: {
    uid: number;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
  };
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    uid: number;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    gender?: string;
    dob?: string;
  };
}

/**
 * Send OTP to email
 */
export async function sendOtp(email: string): Promise<SendOtpResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/users/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to send OTP' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to send OTP');
  }
}

/**
 * Verify OTP code
 */
export async function verifyOtp(
  email: string,
  code: string,
): Promise<VerifyOtpResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/users/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to verify OTP' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to verify OTP');
  }
}

/**
 * Register a new user
 */
export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  gender?: string,
  dob?: string,
): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        gender,
        dob,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Registration failed');
  }
}

export interface ForgotPasswordResponse {
  statusCode: number;
  message: string;
}

export interface VerifyResetTokenResponse {
  statusCode: number;
  valid: boolean;
  email: string;
}

export interface ResetPasswordResponse {
  statusCode: number;
  message: string;
}

/**
 * Request password reset
 */
export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/users/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to send reset link' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to send reset link');
  }
}

/**
 * Login user
 */
export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        const isMobile = typeof window !== 'undefined' && 
          (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
        
        if (isMobile) {
          throw new Error(
            'Unable to connect to server. Make sure:\n' +
            '1. Backend is running on your computer\n' +
            '2. Both devices are on the same network\n' +
            '3. Use your computer\'s IP address (e.g., http://192.168.x.x:3005)'
          );
        }
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Login failed');
  }
}

/**
 * Verify password reset token
 */
export async function verifyResetToken(token: string): Promise<VerifyResetTokenResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/users/verify-reset-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Invalid or expired token' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Invalid or expired token');
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/users/reset-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to reset password' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to reset password');
  }
}

export interface CreateEventResponse {
  statusCode: number;
  message: string;
  data: {
    id: number;
    title: string;
    description: string;
    eventDate: string;
    startTime: string;
    endTime?: string;
    location: string;
    category: string;
    status: string;
    maxAttendees?: number;
  };
}

export interface CreateEventDto {
  organizerId?: number;
  organizationId?: number;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime?: string;
  location: string;
  category: string;
  image?: string;
  maxAttendees?: number;
}

export interface UpdateEventDto {
  organizerId: number;
  title?: string;
  description?: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category?: string;
  image?: string;
  maxAttendees?: number;
}

export interface UpdateEventResponse {
  statusCode: number;
  message: string;
  data: {
    id: number;
    title: string;
    description: string;
    eventDate: string;
    startTime: string;
    endTime?: string;
    location: string;
    category: string;
    status: string;
    maxAttendees?: number;
    image?: string;
  };
}

/**
 * Create a new event
 */
export async function createEvent(eventData: CreateEventDto): Promise<CreateEventResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create event' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to create event');
  }
}

/**
 * Update an existing event
 */
export async function updateEvent(
  eventId: number,
  eventData: UpdateEventDto,
): Promise<UpdateEventResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/events/${eventId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update event' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to update event');
  }
}

export interface UserEvent {
  id: number;
  title: string;
  description: string;
  date: string | Date;
  time: string;
  endTime?: string;
  location: string;
  image?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category: string;
  attendees: number;
  maxAttendees?: number;
  organizerId: number;
  createdAt: string | Date;
  type: 'joined' | 'organized';
}

export interface UserEventsResponse {
  statusCode: number;
  message: string;
  events: UserEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AllEventsResponse {
  statusCode: number;
  message: string;
  events: {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image?: string;
    status: string;
    category: string;
    attendees: number;
    maxAttendees?: number;
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get all events with pagination
 */
export async function getAllEvents(
  page: number = 1,
  limit: number = 10,
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
): Promise<AllEventsResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    const response = await fetch(
      `${getApiUrl()}/events?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch events' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to fetch events');
  }
}

/**
 * Get events for a specific user
 */
export async function getUserEvents(
  userId: number,
  type: 'joined' | 'organized' = 'joined',
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
  page: number = 1,
  limit: number = 10,
): Promise<UserEventsResponse> {
  try {
    const params = new URLSearchParams({
      type,
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    const response = await fetch(
      `${getApiUrl()}/events/user/${userId}?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch events' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to fetch events');
  }
}

export interface EventDetail {
  id: number;
  title: string;
  description: string;
  date: string | Date;
  time: string;
  endTime?: string;
  location: string;
  image?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category: string;
  attendees: number;
  maxAttendees?: number;
  organizerId: number;
  organizerName?: string;
  organizerEmail?: string;
  organizationId?: number;
  organizationName?: string;
  organizationLogo?: string;
  createdAt: string | Date;
  attendeeList?: Array<{
    id: number;
    userId: number;
    status: string;
    registeredAt: string;
    user?: {
      email: string;
    };
  }>;
}

export interface EventDetailResponse {
  statusCode: number;
  message: string;
  data: EventDetail;
}

/**
 * Get event by ID
 */
export async function getEventById(eventId: number): Promise<EventDetailResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/events/${eventId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Event not found' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Event not found');
  }
}

export interface DeleteEventResponse {
  statusCode: number;
  message: string;
}

/**
 * Delete an event
 */
export async function deleteEvent(
  eventId: number,
  organizerId: number,
): Promise<DeleteEventResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ organizerId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete event' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to delete event');
  }
}

export interface TicketInfo {
  ticketCode: string;
  qrCode: string;
}

export interface JoinEventResponse {
  statusCode: number;
  message: string;
  ticket?: TicketInfo;
}

export interface TicketResponse {
  statusCode: number;
  message: string;
  data: {
    ticketCode: string;
    qrCode: string;
    eventTitle: string;
    eventDate: string | Date;
    eventTime: string;
    location: string;
    status: string;
    registeredAt: string | Date;
  };
}

/**
 * Join an event
 */
export async function joinEvent(
  eventId: number,
  userId: number,
): Promise<JoinEventResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/events/${eventId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to join event' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to join event');
  }
}

/**
 * Leave an event
 */
export async function leaveEvent(
  eventId: number,
  userId: number,
): Promise<JoinEventResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/events/${eventId}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to leave event' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to leave event');
  }
}

/**
 * Get user ticket for an event
 */
export async function getUserTicket(
  eventId: number,
  userId: number,
): Promise<TicketResponse> {
  try {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/ticket/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Ticket not found' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error(
          'Unable to connect to server. Please make sure the backend is running.',
        );
      }
      throw error;
    }
    throw new Error('Failed to get ticket');
  }
}

export interface UserTicket {
  eventId: number;
  ticketCode: string;
  qrCode: string;
  eventTitle: string;
  eventDescription: string;
  eventDate: string | Date;
  eventTime: string;
  endTime?: string;
  location: string;
  category: string;
  image?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  registeredAt: string | Date;
}

export interface UserTicketsResponse {
  statusCode: number;
  message: string;
  data: UserTicket[];
}

/**
 * Get all tickets for a user
 */
export async function getUserTickets(
  userId: number,
): Promise<UserTicketsResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/events/tickets/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Failed to fetch tickets' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error(
          'Unable to connect to server. Please make sure the backend is running.',
        );
      }
      throw error;
    }
    throw new Error('Failed to get tickets');
  }
}

export interface VerifyAttendeeResponse {
  statusCode: number;
  message: string;
  data?: {
    attendee: {
      id: number;
      userId: number;
      status: string;
      registeredAt: string;
      user?: {
        email: string;
      } | null;
    };
  };
}

/**
 * Verify an attendee by ticket code
 */
export interface VerifyAttendeeAttendee {
  id: number;
  userId: number;
  status: string;
  registeredAt: string;
  user?: {
    email: string;
  } | null;
}

export async function verifyAttendee(
  eventId: number,
  ticketCode: string,
): Promise<{ success: boolean; message: string; attendee?: VerifyAttendeeAttendee }> {
  try {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/verify-attendee`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketCode }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Failed to verify attendee',
      }));
      return {
        success: false,
        message: errorData.message || `Server error: ${response.status}`,
      };
    }

    const data: VerifyAttendeeResponse = await response.json();
    return {
      success: true,
      message: data.message || 'Attendee verified successfully',
      attendee: data.data?.attendee,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return {
          success: false,
          message:
            'Unable to connect to server. Please make sure the backend is running.',
        };
      }
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: 'Failed to verify attendee',
    };
  }
}

/**
 * Send email notification to all event attendees
 */
export async function sendAttendeeNotifications(eventId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/notify-attendees`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Failed to send email notifications',
      }));
      return {
        success: false,
        message: errorData.message || `Server error: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Email notifications sent successfully',
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to server. Please make sure the backend is running.',
        };
      }
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: 'Failed to send email notifications',
    };
  }
}

// Organization APIs
export interface Organization {
  id: number;
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: number;
  createdAt: string;
  updatedAt: string;
  organizationUsers?: {
    user: {
      email: string;
      userDetail?: {
        first_name: string;
        last_name: string;
      };
    };
  }[];
}

export interface CreateOrganizationDto {
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
  userId?: number;
}

export interface CreateOrganizationResponse {
  statusCode: number;
  message: string;
  data: Organization;
}

export interface GetOrganizationsResponse {
  statusCode: number;
  message: string;
  data: Organization[];
}

/**
 * Create a new organization (pending verification)
 */
export async function createOrganization(
  organizationData: CreateOrganizationDto,
): Promise<CreateOrganizationResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/organizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(organizationData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create organization' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to create organization');
  }
}

/**
 * Get organizations for a user
 */
export async function getUserOrganizations(userId: number): Promise<GetOrganizationsResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/organizations/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch organizations' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to fetch organizations');
  }
}

/**
 * Get organization by ID
 */
export async function getOrganizationById(id: number): Promise<CreateOrganizationResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/organizations/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch organization' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to fetch organization');
  }
}

/**
 * Get pending organizations (admin only)
 */
export async function getPendingOrganizations(): Promise<GetOrganizationsResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/organizations/pending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch pending organizations' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to fetch pending organizations');
  }
}

/**
 * Get all organizations with optional status filter (admin only)
 */
export async function getAllOrganizations(
  status?: 'pending' | 'approved' | 'rejected',
  search?: string,
): Promise<GetOrganizationsResponse> {
  try {
    const params = new URLSearchParams();
    if (status) {
      params.append('status', status);
    }
    if (search) {
      params.append('search', search);
    }

    const response = await fetch(`${getApiUrl()}/organizations?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch organizations' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to fetch organizations');
  }
}

export interface VerifyOrganizationDto {
  approved: boolean;
  rejectionReason?: string;
}

export interface VerifyOrganizationResponse {
  statusCode: number;
  message: string;
  data: Organization;
}

/**
 * Verify/approve or reject an organization (admin only)
 */
export async function verifyOrganization(
  organizationId: number,
  dto: VerifyOrganizationDto,
): Promise<VerifyOrganizationResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/organizations/${organizationId}/verify`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to verify organization' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to verify organization');
  }
}

/**
 * Update an organization (admin only)
 */
export async function updateOrganization(
  organizationId: number,
  dto: Partial<CreateOrganizationDto>,
): Promise<CreateOrganizationResponse> {
  try {
    // Get userId from localStorage
    let userId: number = 1; // Default fallback
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = parseInt(user.id, 10);
          if (isNaN(userId)) {
            console.error('Invalid user ID, using fallback');
            userId = 1;
          }
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }
    }

    const payload = { ...dto, userId };
    console.log('Updating organization:', { 
      organizationId, 
      userId, 
      dto,
      payload,
      url: `${getApiUrl()}/organizations/${organizationId}`
    });

    const response = await fetch(`${getApiUrl()}/organizations/${organizationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const responseText = await response.text();
      console.error('Error response text:', responseText);
      
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText || 'Failed to update organization' };
      }
      
      console.error('Update organization error:', errorData);
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to update organization');
  }
}

export interface DeleteOrganizationResponse {
  statusCode: number;
  message: string;
}

/**
 * Delete an organization (admin only)
 */
export async function deleteOrganization(
  organizationId: number,
): Promise<DeleteOrganizationResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/organizations/${organizationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete organization' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to delete organization');
  }
}

// ==================== USER MANAGEMENT APIs ====================

export interface User {
  uid: number;
  email: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  userDetail?: {
    first_name: string;
    last_name: string;
    gender: string | null;
    dob: string | null;
    phone_number: string | null;
    date_of_birth: string | null;
    address: string | null;
  };
}

export interface GetAllUsersResponse {
  statusCode: number;
  message: string;
  data: User[];
}

/**
 * Get all users with optional filters
 */
export async function getAllUsers(
  search?: string,
  role?: string,
  isActive?: boolean,
): Promise<GetAllUsersResponse> {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    if (isActive !== undefined) params.append('isActive', String(isActive));

    const queryString = params.toString();
    const url = `${getApiUrl()}/users${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch users' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to fetch users');
  }
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  gender?: string;
  birthdate?: string;
}

export interface CreateUserResponse {
  statusCode: number;
  message: string;
  data: {
    uid: number;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    gender?: string | null;
    dob?: string | null;
  };
}

/**
 * Create a new user (Admin)
 */
export async function createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create user' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to create user');
  }
}

/**
 * Update a user (Admin)
 */
export async function updateUser(uid: number, userData: Partial<CreateUserRequest>): Promise<CreateUserResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/users/${uid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update user' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
    throw new Error('Failed to update user');
  }
}

/**
 * Archive a user
 */
export async function archiveUser(uid: number): Promise<{ statusCode: number; message: string }> {
  try {
    const response = await fetch(`${getApiUrl()}/users/${uid}/archive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to archive user' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to archive user');
  }
}

/**
 * Restore an archived user
 */
export async function restoreUser(uid: number): Promise<{ statusCode: number; message: string }> {
  try {
    const response = await fetch(`${getApiUrl()}/users/${uid}/restore`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to restore user' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to restore user');
  }
}

