import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Note } from '../../notes/entities/note.entity';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ 
    example: 1,
    description: 'The unique identifier for the user'
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    example: 'user@example.com',
    description: 'User email address (unique)'
  })
  @Column({ unique: true })
  email: string;

  @ApiHideProperty() // Hide password from Swagger docs for security
  @Column()
  password: string; // This will store the hashed password

  @ApiHideProperty() // Hide related notes from Swagger docs
  @OneToMany(() => Note, note => note.user)
  notes: Note[];

  @ApiProperty({ 
    example: '2025-10-05T12:00:00Z',
    description: 'The date and time when the user account was created'
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ 
    example: '2025-10-05T12:00:00Z',
    description: 'The date and time when the user account was last updated'
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
