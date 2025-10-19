import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('tasks') 
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: ''})
  findOne(@Param('id') id: number) {
    return this.taskService.findOne(id);
  }

  @Post(':id')
  @ApiParam({ name: 'id'})
  @ApiBody({
    description: '',
    schema: {
      example: {
        title: '',
        completed: false,
      },
    },
  })
  create(@Body() task: Task) {
    return this.taskService.create(task);
  }

  @Put(':id')
  @ApiParam({ name: 'id'})
  @ApiBody({
    description: '',
    schema: {
      example: {
        title: '',
        completed: false,
      },
    },
  })
  update(@Param('id') id: number, @Body() task: Partial<Task>) {
    return this.taskService.update(id, task);
  }

  @Delete(':id')
  @ApiParam({ name: 'id'})
  remove(@Param('id') id: number) {
    return this.taskService.remove(id);
  }
}
