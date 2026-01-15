import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Otp } from '../entities/otp.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class OtpService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    // Configure nodemailer transporter
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpSecure = process.env.SMTP_SECURE === 'true';

    console.log('SMTP Configuration Check:');
    console.log(`SMTP_HOST: ${smtpHost}`);
    console.log(`SMTP_PORT: ${smtpPort}`);
    console.log(`SMTP_USER: ${smtpUser ? '***configured***' : 'NOT SET'}`);
    console.log(`SMTP_PASS: ${smtpPass ? '***configured***' : 'NOT SET'}`);

    if (smtpUser && smtpPass) {
      try {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        // Verify transporter configuration
        this.transporter.verify((error) => {
          if (error) {
            console.error('SMTP Connection Error:', error);
          } else {
            console.log('SMTP server is ready to send emails');
          }
        });
      } catch (error) {
        console.error('Error creating SMTP transporter:', error);
      }
    } else {
      console.warn(
        'SMTP credentials not configured. OTP emails will not be sent. Please set SMTP_USER and SMTP_PASS environment variables.',
      );
    }
  }

  /**
   * Generate a 6-digit OTP code
   */
  generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP to email
   */
  async sendOtp(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check if user with this email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        return {
          success: false,
          message: 'An account with this email address already exists. Please sign in instead.',
        };
      }

      // Invalidate any existing OTPs for this email
      await this.otpRepository.update(
        { email, isVerified: false },
        { isVerified: true },
      );

      // Generate new OTP
      const code = this.generateOtpCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes

      // Save OTP to database
      const otp = this.otpRepository.create({
        email,
        code,
        expiresAt,
        isVerified: false,
      });
      await this.otpRepository.save(otp);

      // Send email
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Your Occasio Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Verify Your Email</h2>
            <p>Thank you for signing up with Occasio!</p>
            <p>Your verification code is:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px;">
              ${code}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">© 2026 Occasio. All rights reserved.</p>
          </div>
        `,
      };

      // Send email only if transporter is configured
      if (this.transporter) {
        try {
          await this.transporter.sendMail(mailOptions);
          console.log('Email sent successfully to:', email);
          return {
            success: true,
            message: 'OTP sent successfully to your email',
          };
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          // Return error details for debugging
          const errorMessage =
            emailError instanceof Error ? emailError.message : 'Unknown error';
          throw new Error(`Failed to send email: ${errorMessage}`);
        }
      } else {
        // Development mode: log OTP to console and return it in response
        console.log(`[DEV MODE] OTP for ${email}: ${code}`);
        console.log(
          `[DEV MODE] Access the OTP from the API response or check console logs`,
        );
        return {
          success: true,
          message: `OTP sent (DEV MODE - Check console): ${code}`,
          devMode: true,
          otp: code,
        } as {
          success: boolean;
          message: string;
          devMode: boolean;
          otp: string;
        };
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.',
      };
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(
    email: string,
    code: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Clean up expired OTPs
      await this.otpRepository.delete({
        expiresAt: LessThan(new Date()),
      });

      // Find valid OTP
      const otp = await this.otpRepository.findOne({
        where: {
          email,
          code,
          isVerified: false,
        },
        order: {
          createdAt: 'DESC',
        },
      });

      if (!otp) {
        return {
          success: false,
          message: 'Invalid or expired OTP code',
        };
      }

      // Check if OTP is expired
      if (new Date() > otp.expiresAt) {
        await this.otpRepository.update({ id: otp.id }, { isVerified: true });
        return {
          success: false,
          message: 'OTP code has expired. Please request a new one.',
        };
      }

      // Mark OTP as verified
      await this.otpRepository.update({ id: otp.id }, { isVerified: true });

      return {
        success: true,
        message: 'OTP verified successfully',
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Failed to verify OTP. Please try again.',
      };
    }
  }
}
