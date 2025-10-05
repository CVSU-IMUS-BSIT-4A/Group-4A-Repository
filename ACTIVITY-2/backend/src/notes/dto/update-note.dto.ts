import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @ApiProperty({
    description: 'Fields are optional for updates - only provide what needs to change',
    required: false
  })
  override title?: string;

  @ApiProperty({
    description: 'Optional content to update',
    required: false
  })
  override content?: string;
}
