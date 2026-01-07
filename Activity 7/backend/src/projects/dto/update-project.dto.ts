import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class UpdateProjectDto {
  @ApiProperty({
    description: "Project name",
    required: false,
    example: "Website Redesign",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "Project description",
    required: false,
    example: "Redesign the company website",
  })
  @IsOptional()
  @IsString()
  description?: string;
}
