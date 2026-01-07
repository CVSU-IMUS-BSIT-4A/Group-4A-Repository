import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsInt,
  IsDateString,
} from "class-validator";

export class CreateTaskDto {
  @ApiProperty({
    description: "Task title",
    example: "Design homepage",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Task description",
    required: false,
    example: "Create a modern homepage design",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Task deadline (ISO date)",
    required: false,
    example: "2024-12-31",
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiProperty({
    description: "Task status",
    required: false,
    enum: ["backlog", "todo", "in_progress", "in_review", "done"],
    example: "todo",
  })
  @IsOptional()
  @IsIn(["backlog", "todo", "in_progress", "in_review", "done"])
  status?: "backlog" | "todo" | "in_progress" | "in_review" | "done";

  @ApiProperty({
    description: "Approval status",
    required: false,
    enum: ["approved", "pending", "overdue"],
    example: "pending",
  })
  @IsOptional()
  @IsIn(["approved", "pending", "overdue"])
  approvalStatus?: "approved" | "pending" | "overdue";

  @ApiProperty({
    description: "Project ID (optional)",
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  projectId?: number;
}
