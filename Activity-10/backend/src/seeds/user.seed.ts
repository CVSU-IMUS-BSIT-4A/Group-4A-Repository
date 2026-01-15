import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { UserDetail } from '../entities/user-detail.entity';

interface SeedUserData {
  email: string;
  password: string;
  role?: UserRole;
  first_name?: string;
  last_name?: string;
  gender?: string;
  dob?: string;
}

export const userSeedData: SeedUserData[] = [
  // Admin accounts
  {
    email: 'admin@example.com',
    password: 'Admin123!',
    role: UserRole.ADMIN,
    first_name: 'Admin',
    last_name: 'User',
    gender: 'male',
    dob: '1985-01-01',
  },
  // Regular user accounts
  {
    email: 'john.doe@example.com',
    password: 'Password123!',
    role: UserRole.USER,
    first_name: 'John',
    last_name: 'Doe',
    gender: 'male',
    dob: '1990-05-15',
  },
  {
    email: 'jane.smith@example.com',
    password: 'Password123!',
    role: UserRole.USER,
    first_name: 'Jane',
    last_name: 'Smith',
    gender: 'female',
    dob: '1992-08-22',
  },
  {
    email: 'michael.johnson@example.com',
    password: 'Password123!',
    role: UserRole.USER,
    first_name: 'Michael',
    last_name: 'Johnson',
    gender: 'male',
    dob: '1988-03-10',
  },
  {
    email: 'emily.williams@example.com',
    password: 'Password123!',
    role: UserRole.USER,
    first_name: 'Emily',
    last_name: 'Williams',
    gender: 'female',
    dob: '1995-11-30',
  },
  {
    email: 'david.brown@example.com',
    password: 'Password123!',
    role: UserRole.USER,
    first_name: 'David',
    last_name: 'Brown',
    gender: 'male',
    dob: '1991-07-18',
  },
  {
    email: 'sarah.davis@example.com',
    password: 'Password123!',
    role: UserRole.USER,
    first_name: 'Sarah',
    last_name: 'Davis',
    gender: 'female',
    dob: '1993-02-25',
  },
  {
    email: 'robert.miller@example.com',
    password: 'Password123!',
    role: UserRole.USER,
    first_name: 'Robert',
    last_name: 'Miller',
    gender: 'male',
    dob: '1989-09-12',
  },
  {
    email: 'lisa.wilson@example.com',
    password: 'Password123!',
    role: UserRole.USER,
    first_name: 'Lisa',
    last_name: 'Wilson',
    gender: 'female',
    dob: '1994-06-05',
  },
  {
    email: 'james.moore@example.com',
    password: 'Password123!',
    role: UserRole.USER,
    first_name: 'James',
    last_name: 'Moore',
    gender: 'male',
    dob: '1992-12-20',
  },
  {
    email: 'amanda.taylor@example.com',
    password: 'Password123!',
    role: UserRole.USER,
    first_name: 'Amanda',
    last_name: 'Taylor',
    gender: 'female',
    dob: '1996-04-14',
  },
];

export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const userDetailRepository = dataSource.getRepository(UserDetail);

  console.log('Starting user seed...');

  for (const userData of userSeedData) {
    try {
      // Check if user already exists
      const existingUser = await userRepository.findOne({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user with specified role (default to USER if not specified)
      const user = userRepository.create({
        email: userData.email,
        password: hashedPassword,
        role: userData.role || UserRole.USER,
      });

      const savedUser = await userRepository.save(user);

      // Create user detail if provided (for both admin and regular users)
      if (userData.first_name || userData.last_name) {
        const userDetail = userDetailRepository.create({
          uid: savedUser.uid,
          first_name: userData.first_name || null,
          last_name: userData.last_name || null,
          gender: userData.gender || null,
          dob: userData.dob ? new Date(userData.dob) : null,
        });

        await userDetailRepository.save(userDetail);
      }

      const roleLabel = savedUser.role === UserRole.ADMIN ? ' [ADMIN]' : '';
      console.log(`✓ Created user: ${userData.email}${roleLabel}`);
    } catch (error) {
      console.error(`✗ Failed to create user ${userData.email}:`, error);
    }
  }

  console.log('User seed completed!');
}
