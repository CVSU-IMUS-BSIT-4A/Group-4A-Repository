import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional, IsUrl } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Matrix' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A computer hacker learns about the true nature of reality' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Sci-Fi' })
  @IsString()
  @IsNotEmpty()
  genre: string;

  @ApiProperty({ example: 'https://example.com/matrix.jpg' })
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ example: 1999 })
  @IsInt()
  @IsNotEmpty()
  releaseYear: number;
}
