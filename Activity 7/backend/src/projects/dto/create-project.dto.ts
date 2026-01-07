import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateProjectDto {
  @ApiProperty({ description: "Project name", example: "Website Redesign" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Project description",
    required: false,
    example: "Redesign the company website",
  })
  @IsOptional()
  @IsString()
  description?: string;
}
