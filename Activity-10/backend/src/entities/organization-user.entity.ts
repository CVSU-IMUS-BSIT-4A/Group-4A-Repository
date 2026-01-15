import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity('organization_users')
@Unique(['organizationId', 'userId'])
export class OrganizationUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'organization_id' })
  organizationId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ default: false })
  isPrimary: boolean; // Primary contact/admin for the organization

  @ManyToOne(() => Organization, (organization) => organization.organizationUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

