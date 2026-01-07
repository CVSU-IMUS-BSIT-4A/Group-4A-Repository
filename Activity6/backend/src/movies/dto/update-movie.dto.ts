import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @ApiProperty({ example: 4.5, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  averageRating?: number;
}
