import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateTaskDto } from './DTO/create-task.dto';
import { UpdateTaskDto } from './DTO/update-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID of the task to retrieve', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Post()
  @ApiBody({ type: CreateTaskDto, description: 'Data to create a new task' })
  create(@Body() task: CreateTaskDto): Promise<Task> {
    return this.taskService.create(task);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'ID of the task to update', type: Number })
  @ApiBody({ type: UpdateTaskDto, description: 'Data to update the task' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdateTaskDto
  ): Promise<Task> {
    return this.taskService.update(id, task);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID of the task to delete', type: Number })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taskService.remove(id);
  }
}
