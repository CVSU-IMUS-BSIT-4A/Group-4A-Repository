import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { EventAttendee } from './event-attendee.entity';
import { Organization } from './organization.entity';

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ name: 'event_date' })
  eventDate: Date;

  @Column({ name: 'start_time' })
  startTime: string;

  @Column({ name: 'end_time', nullable: true })
  endTime: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'text',
    default: EventStatus.UPCOMING,
  })
  status: EventStatus;

  @Column()
  category: string;

  @Column({ name: 'max_attendees', nullable: true })
  maxAttendees: number;

  @Column({ name: 'organizer_id', nullable: true })
  organizerId: number;

  @Column({ name: 'organization_id', nullable: true })
  organizationId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'organizer_id' })
  organizer: User;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => EventAttendee, (attendee) => attendee.event)
  attendees: EventAttendee[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
