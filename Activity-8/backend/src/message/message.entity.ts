import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Message {
  @ApiProperty({ description: 'Message ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Chatroom ID', example: 1 })
  @Column()
  chatroomId: number;

  @ApiProperty({ description: 'Username of the message sender', example: 'John Doe' })
  @Column()
  username: string;

  @ApiProperty({ description: 'Message content', example: 'Hello, world!' })
  @Column()
  message: string;
}
