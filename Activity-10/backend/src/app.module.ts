import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { UserDetail } from './entities/user-detail.entity';
import { Otp } from './entities/otp.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { Event } from './entities/event.entity';
import { EventAttendee } from './entities/event-attendee.entity';
import { Organization } from './entities/organization.entity';
import { OrganizationUser } from './entities/organization-user.entity';
import { OtpService } from './services/otp.service';
import { OtpController } from './controllers/otp.controller';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { EventService } from './services/event.service';
import { EventController } from './controllers/event.controller';
import { OrganizationService } from './services/organization.service';
import { OrganizationController } from './controllers/organization.controller';
import { FileUploadUtil } from './utils/file-upload.util';
import { TicketUtil } from './utils/ticket.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
    }),
    TypeOrmModule.forFeature([
      User,
      UserDetail,
      Otp,
      PasswordReset,
      Event,
      EventAttendee,
      Organization,
      OrganizationUser,
    ]),
  ],
  controllers: [AppController, OtpController, UserController, EventController, OrganizationController],
  providers: [
    AppService,
    OtpService,
    UserService,
    EventService,
    OrganizationService,
    FileUploadUtil,
    TicketUtil,
  ],
})
export class AppModule {}
