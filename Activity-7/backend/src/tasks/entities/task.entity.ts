// src/tasks/entities/task.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'date', nullable: true })
  deadline?: string;

  @Column({ default: 'todo' })
  status: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';

  @Column({ default: 'pending' })
  approvalStatus: 'approved' | 'pending' | 'overdue';

  @ManyToOne(() => Project, project => project.tasks, { onDelete: 'CASCADE', nullable: true })
  project?: Project;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true, eager: true })
  assignedTo?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
