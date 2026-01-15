import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { User, UserRole } from '../entities/user.entity';
import { UserDetail } from '../entities/user-detail.entity';
import { Otp } from '../entities/otp.entity';
import { PasswordReset } from '../entities/password-reset.entity';

@Injectable()
export class UserService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserDetail)
    private userDetailRepository: Repository<UserDetail>,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
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
        console.error('Error creating SMTP transporter in UserService:', error);
      }
    }
  }

  /**
   * Generate a secure random token
   */
  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    gender?: string,
    dob?: string,
  ) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        'An account with this email address already exists. Please sign in instead.',
      );
    }

    // Check if OTP is verified (within last 30 minutes)
    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);

    const verifiedOtp = await this.otpRepository.findOne({
      where: { email, isVerified: true },
      order: { createdAt: 'DESC' },
    });

    if (!verifiedOtp || verifiedOtp.createdAt < thirtyMinutesAgo) {
      throw new BadRequestException(
        'Please verify your email with OTP first. OTP verification expires after 30 minutes.',
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: UserRole.USER,
    });

    const savedUser = await this.userRepository.save(user);

    // Create user detail
    const userDetail = new UserDetail();
    userDetail.uid = savedUser.uid;
    userDetail.first_name = firstName;
    userDetail.last_name = lastName;
    userDetail.gender = gender || null;
    userDetail.dob = dob ? new Date(dob) : null;

    await this.userDetailRepository.save(userDetail);

    return {
      uid: savedUser.uid,
      email: savedUser.email,
      role: savedUser.role,
      first_name: firstName,
      last_name: lastName,
    };
  }

  async createUserByAdmin(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserRole,
    gender?: string,
    dob?: string,
  ) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        'An account with this email address already exists.',
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: role || UserRole.USER,
    });

    const savedUser = await this.userRepository.save(user);

    // Create user detail
    const userDetail = new UserDetail();
    userDetail.uid = savedUser.uid;
    userDetail.first_name = firstName;
    userDetail.last_name = lastName;
    userDetail.gender = gender || null;
    userDetail.dob = dob ? new Date(dob) : null;

    await this.userDetailRepository.save(userDetail);

    return {
      uid: savedUser.uid,
      email: savedUser.email,
      role: savedUser.role,
      first_name: firstName,
      last_name: lastName,
      gender: gender || null,
      dob: dob || null,
    };
  }

  async login(email: string, password: string) {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new UnauthorizedException(
        'Your account has been archived. Please contact support.',
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Get user details
    const userDetail = await this.userDetailRepository.findOne({
      where: { uid: user.uid },
    });

    // Handle dob - it might be a Date object or a string
    let dobString: string | null = null;
    if (userDetail?.dob) {
      if (userDetail.dob instanceof Date) {
        dobString = userDetail.dob.toISOString().split('T')[0];
      } else {
        // Already a string
        dobString = String(userDetail.dob).split('T')[0];
      }
    }

    return {
      uid: user.uid,
      email: user.email,
      role: user.role,
      first_name: userDetail?.first_name || '',
      last_name: userDetail?.last_name || '',
      gender: userDetail?.gender || null,
      dob: dobString,
    };
  }

  async forgotPassword(email: string) {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('No account found with this email address');
    }

    // Invalidate any existing reset tokens for this email
    await this.passwordResetRepository.update(
      { email, isUsed: false },
      { isUsed: true },
    );

    // Generate new reset token
    const token = this.generateResetToken();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // Token expires in 30 minutes

    // Save reset token to database
    const passwordReset = this.passwordResetRepository.create({
      email,
      token,
      expiresAt,
      isUsed: false,
    });
    await this.passwordResetRepository.save(passwordReset);

    // Get user details for the email
    const userDetail = await this.userDetailRepository.findOne({
      where: { uid: user.uid },
    });

    const userName = userDetail ? `${userDetail.first_name}` : 'User';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/forgot-password/reset?token=${token}`;

    // Send email
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Reset Your Occasio Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>Hi ${userName},</p>
          <p>We received a request to reset your password for your Occasio account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #171717; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: 500; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all; font-size: 14px;">${resetLink}</p>
          <p>This link will expire in 30 minutes.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">© 2026 Occasio. All rights reserved.</p>
        </div>
      `,
    };

    // Send email only if transporter is configured
    if (this.transporter) {
      try {
        await this.transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully to:', email);
      } catch (emailError) {
        console.error('Error sending password reset email:', emailError);
        throw new BadRequestException(
          'Failed to send password reset email. Please try again.',
        );
      }
    } else {
      throw new BadRequestException(
        'Failed to send password reset email. Please try again.',
      );
    }

    return {
      success: true,
      message: 'Password reset link sent to your email',
    };
  }

  async verifyResetToken(token: string) {
    // Clean up expired tokens
    await this.passwordResetRepository.delete({
      expiresAt: LessThan(new Date()),
    });

    // Find valid token
    const resetToken = await this.passwordResetRepository.findOne({
      where: {
        token,
        isUsed: false,
      },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Check if token is expired
    if (new Date() > resetToken.expiresAt) {
      await this.passwordResetRepository.update(
        { id: resetToken.id },
        { isUsed: true },
      );
      throw new BadRequestException(
        'Reset token has expired. Please request a new one.',
      );
    }

    return {
      valid: true,
      email: resetToken.email,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    // Verify token first
    const tokenData = await this.verifyResetToken(token);

    // Find user
    const user = await this.userRepository.findOne({
      where: { email: tokenData.email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password using save() for reliability
    user.password = hashedPassword;
    await this.userRepository.save(user);

    // Mark token as used
    await this.passwordResetRepository.update({ token }, { isUsed: true });

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  async getAllUsers(search?: string, role?: string, isActive?: boolean) {
    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.userDetail', 'userDetail');

      if (search) {
        queryBuilder.andWhere(
          '(user.email LIKE :search OR userDetail.first_name LIKE :search OR userDetail.last_name LIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (role) {
        queryBuilder.andWhere('user.role = :role', { role });
      }

      if (isActive !== undefined) {
        queryBuilder.andWhere('user.is_active = :isActive', { isActive });
      }

      const users = await queryBuilder
        .orderBy('user.created_at', 'DESC')
        .getMany();

      // Transform to match frontend expectations
      return users.map((user) => ({
        uid: user.uid,
        email: user.email,
        role: user.role,
        isActive: Boolean(user.is_active),
        isEmailVerified: false, // Default value since column doesn't exist
        createdAt: user.created_at,
        updatedAt: user.created_at, // Use created_at as fallback
        userDetail: user.userDetail,
      }));
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw new BadRequestException('Failed to retrieve users');
    }
  }

  async updateUser(
    uid: number,
    email?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    role?: UserRole,
    gender?: string,
    dob?: string,
  ) {
    const user = await this.userRepository.findOne({ 
      where: { uid },
      relations: ['userDetail'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException(
          'An account with this email address already exists.',
        );
      }
      user.email = email;
    }

    // Update password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Update role if provided
    if (role) {
      user.role = role;
    }

    await this.userRepository.save(user);

    // Update user detail
    let userDetail = user.userDetail;
    if (!userDetail) {
      userDetail = new UserDetail();
      userDetail.uid = uid;
    }

    if (firstName !== undefined) userDetail.first_name = firstName;
    if (lastName !== undefined) userDetail.last_name = lastName;
    if (gender !== undefined) userDetail.gender = gender || null;
    if (dob !== undefined) userDetail.dob = dob ? new Date(dob) : null;

    await this.userDetailRepository.save(userDetail);

    return {
      uid: user.uid,
      email: user.email,
      role: user.role,
      first_name: userDetail.first_name,
      last_name: userDetail.last_name,
      gender: userDetail.gender,
      dob: userDetail.dob,
    };
  }

  async archiveUser(uid: number) {
    const user = await this.userRepository.findOne({ where: { uid } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.is_active = false;
    await this.userRepository.save(user);

    return {
      success: true,
      message: 'User archived successfully',
    };
  }

  async restoreUser(uid: number) {
    const user = await this.userRepository.findOne({ where: { uid } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.is_active = true;
    await this.userRepository.save(user);

    return {
      success: true,
      message: 'User restored successfully',
    };
  }
}
