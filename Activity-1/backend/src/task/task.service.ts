import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './DTO/create-task.dto';
import { UpdateTaskDto } from './DTO/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  async create(task: CreateTaskDto): Promise<Task> {
    const newTask = this.taskRepository.create(task);
    return this.taskRepository.save(newTask);
  }

  async update(id: number, task: UpdateTaskDto): Promise<Task> {
    // Check if task exists first
    const existingTask = await this.taskRepository.findOneBy({ id });
    if (!existingTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    // Merge updated data and save
    const updatedTask = this.taskRepository.merge(existingTask, task);
    return this.taskRepository.save(updatedTask);
  }

  async remove(id: number): Promise<void> {
    // Check if task exists first
    const existingTask = await this.taskRepository.findOneBy({ id });
    if (!existingTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    await this.taskRepository.delete(id);
  }
}
