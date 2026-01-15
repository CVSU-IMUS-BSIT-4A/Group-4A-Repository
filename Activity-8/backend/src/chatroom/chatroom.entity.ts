import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Chatroom {
  @ApiProperty({ description: 'Chatroom ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Chatroom name', example: 'General Chat' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Chatroom description', example: 'General discussion room', nullable: true, required: false })
  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Chatroom icon', example: '💬', nullable: true, required: false })
  @Column({ type: 'varchar', nullable: true, default: '💬' })
  icon: string | null;
}
