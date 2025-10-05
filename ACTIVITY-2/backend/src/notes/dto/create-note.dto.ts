import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ 
    example: 'Meeting Notes', 
    description: 'Title of the note',
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'Discussed project timeline and assigned tasks.', 
    description: 'Content of the note'
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
