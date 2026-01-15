import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateChatroomDto {
  @ApiProperty({ description: 'Chatroom name', example: 'Updated Chat', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Chatroom description', example: 'Updated description', required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Chatroom icon', example: '🎉', required: false, nullable: true })
  @IsOptional()
  @IsString()
  icon?: string;
}

