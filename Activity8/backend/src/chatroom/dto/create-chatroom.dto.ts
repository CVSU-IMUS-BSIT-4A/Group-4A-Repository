import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateChatroomDto {
  @ApiProperty({ description: 'Chatroom name', example: 'General Chat' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Chatroom description', example: 'General discussion room', required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Chatroom icon', example: '💬', required: false, nullable: true })
  @IsOptional()
  @IsString()
  icon?: string;
}

