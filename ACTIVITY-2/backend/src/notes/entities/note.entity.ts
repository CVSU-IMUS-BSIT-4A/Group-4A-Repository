import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity('notes')
export class Note {
  @ApiProperty({ 
    example: 1,
    description: 'The unique identifier for the note'
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    example: 'Meeting Notes',
    description: 'The title of the note',
    maxLength: 255
  })
  @Column({ length: 255 })
  title: string;

  @ApiProperty({ 
    example: 'Discussed project timeline and assigned tasks.',
    description: 'The content of the note'
  })
  @Column('text')
  content: string;

  @ApiHideProperty() // Hide user property from Swagger docs for security
  @ManyToOne(() => User, user => user.notes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ 
    example: '2025-10-05T12:00:00Z',
    description: 'The date and time when the note was created'
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ 
    example: '2025-10-05T14:30:00Z',
    description: 'The date and time when the note was last updated'
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
