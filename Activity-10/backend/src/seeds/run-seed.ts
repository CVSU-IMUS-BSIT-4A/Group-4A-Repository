import { DataSource } from 'typeorm';
import { seedUsers } from './user.seed';
import { User } from '../entities/user.entity';
import { UserDetail } from '../entities/user-detail.entity';
import { Otp } from '../entities/otp.entity';
import { PasswordReset } from '../entities/password-reset.entity';
import { Event } from '../entities/event.entity';
import { EventAttendee } from '../entities/event-attendee.entity';
import { Organization } from '../entities/organization.entity';
import { OrganizationUser } from '../entities/organization-user.entity';

async function runSeed() {
  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'database.sqlite',
    entities: [
      User,
      UserDetail,
      Otp,
      PasswordReset,
      Event,
      EventAttendee,
      Organization,
      OrganizationUser,
    ],
    synchronize: false, // Don't auto-sync when seeding
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    await seedUsers(dataSource);

    await dataSource.destroy();
    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running seed:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

runSeed();
