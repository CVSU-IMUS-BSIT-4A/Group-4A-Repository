import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('users_detail')
export class UserDetail {
  @PrimaryGeneratedColumn({ name: 'detail_id' })
  detail_id: number;

  @Column({ name: 'uid', unique: true })
  uid: number;

  @Column({ name: 'first_name', type: 'text', nullable: true })
  first_name: string | null;

  @Column({ name: 'last_name', type: 'text', nullable: true })
  last_name: string | null;

  @Column({ type: 'text', nullable: true })
  gender: string | null;

  @Column({ type: 'date', nullable: true })
  dob: Date | null;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uid' })
  user: User;
}
