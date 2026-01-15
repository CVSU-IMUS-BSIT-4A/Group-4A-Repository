import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateMessageDto {
  @ApiProperty({ description: 'Message content', example: 'Updated message text', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}

