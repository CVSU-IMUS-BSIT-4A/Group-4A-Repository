import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Project } from '../projects/entities/project.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    let project: Project | undefined = undefined;

    if (createTaskDto.projectId) {
      const foundProject = await this.projectRepository.findOne({
        where: { id: createTaskDto.projectId },
      });

      if (!foundProject) {
        throw new NotFoundException(
          `Project with ID ${createTaskDto.projectId} not found`,
        );
      }
      project = foundProject;
    }

    // Exclude projectId from the task data since it's a relation, not a column
    const { projectId, ...taskData } = createTaskDto;

    const task = this.taskRepository.create({
      ...taskData,
      project: project || undefined,
    });

    return this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      relations: ['project'],
    });
  }

  async findByProject(projectId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { project: { id: projectId } },
      relations: ['project'],
    });
  }

  async findOne(id: number): Promise<Task | null> {
    return this.taskRepository.findOne({
      where: { id },
      relations: ['project'],
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!task) {
      return null;
    }

    let project: Project | undefined = task.project;

    if (updateTaskDto.projectId !== undefined) {
      if (updateTaskDto.projectId === null) {
        project = undefined;
      } else {
        const foundProject = await this.projectRepository.findOne({
          where: { id: updateTaskDto.projectId },
        });

        if (!foundProject) {
          throw new NotFoundException(
            `Project with ID ${updateTaskDto.projectId} not found`,
          );
        }
        project = foundProject;
      }
    }

    // Exclude projectId from the update data since it's a relation, not a column
    const { projectId, ...updateData } = updateTaskDto;

    Object.assign(task, {
      ...updateData,
      project: project || undefined,
    });

    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    await this.taskRepository.remove(task);
  }
}
