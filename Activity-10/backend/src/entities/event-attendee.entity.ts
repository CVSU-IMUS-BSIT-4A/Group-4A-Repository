import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

export enum AttendeeStatus {
  REGISTERED = 'registered',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  ATTENDED = 'attended',
}

@Entity('event_attendees')
@Unique(['eventId', 'userId'])
export class EventAttendee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'event_id' })
  eventId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({
    type: 'text',
    default: AttendeeStatus.REGISTERED,
  })
  status: AttendeeStatus;

  @Column({ name: 'ticket_code', unique: true, nullable: true })
  ticketCode: string;

  @Column({ name: 'qr_code', type: 'text', nullable: true })
  qrCode: string;

  @ManyToOne(() => Event, (event) => event.attendees, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'registered_at' })
  registeredAt: Date;
}
