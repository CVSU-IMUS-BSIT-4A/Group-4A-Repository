import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';

export interface TicketData {
  ticketCode: string;
  eventId: number;
  eventTitle: string;
  userId: number;
  userName: string;
  eventDate: Date;
  eventTime: string;
  location: string;
}

@Injectable()
export class TicketUtil {
  /**
   * Generate a unique ticket code
   */
  generateTicketCode(eventId: number, userId: number): string {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(4).toString('hex');
    const hash = crypto
      .createHash('sha256')
      .update(`${eventId}-${userId}-${timestamp}-${random}`)
      .digest('hex')
      .substring(0, 8)
      .toUpperCase();

    return `TKT-${eventId}-${hash}`;
  }

  /**
   * Generate QR code as base64 data URL
   * Encodes only the ticket code for simplicity and reliability
   */
  async generateQRCode(ticketData: TicketData): Promise<string> {
    try {
      // Generate QR code with just the ticket code
      // The ticket code format (TKT-{eventId}-{hash}) contains all necessary information
      const qrCodeDataUrl = await QRCode.toDataURL(ticketData.ticketCode, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Verify ticket code format
   */
  isValidTicketCode(ticketCode: string): boolean {
    const pattern = /^TKT-\d+-[A-Z0-9]{8}$/;
    return pattern.test(ticketCode);
  }
}
