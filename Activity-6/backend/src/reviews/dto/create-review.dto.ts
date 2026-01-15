import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  reviewerName: string;

  @ApiProperty({ example: 'Great movie! Really enjoyed it.' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  movieId: number;
}
