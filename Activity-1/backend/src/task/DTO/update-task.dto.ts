import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Buy groceries' })
  title?: string;

  @ApiPropertyOptional({ example: true })
  completed?: boolean;
}
