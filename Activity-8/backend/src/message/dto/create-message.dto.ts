import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ description: 'Chatroom ID', example: 1 })
  @IsNumber()
  chatroomId: number;

  @ApiProperty({ description: 'Username of the message sender', example: 'John Doe' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Message content', example: 'Hello, world!' })
  @IsString()
  message: string;
}

