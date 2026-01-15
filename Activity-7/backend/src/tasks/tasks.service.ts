import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    let project: Project | undefined = undefined;
    let assignedTo: User | undefined = undefined;

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

    if (createTaskDto.assignedToId) {
      const foundUser = await this.userRepository.findOne({
        where: { id: createTaskDto.assignedToId },
      });

      if (!foundUser) {
        throw new NotFoundException(
          `User with ID ${createTaskDto.assignedToId} not found`,
        );
      }
      assignedTo = foundUser;
    }

    // Exclude projectId and assignedToId from the task data since they're relations, not columns
    const { projectId, assignedToId, ...taskData } = createTaskDto;

    const task = this.taskRepository.create({
      ...taskData,
      project: project || undefined,
      assignedTo: assignedTo || undefined,
    });

    return this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      relations: ['project', 'assignedTo'],
    });
  }

  async findByProject(projectId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { project: { id: projectId } },
      relations: ['project', 'assignedTo'],
    });
  }

  async findOne(id: number): Promise<Task | null> {
    return this.taskRepository.findOne({
      where: { id },
      relations: ['project', 'assignedTo'],
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project', 'assignedTo'],
    });

    if (!task) {
      return null;
    }

    let project: Project | undefined = task.project;
    let assignedTo: User | undefined = task.assignedTo;

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

    if (updateTaskDto.assignedToId !== undefined) {
      if (updateTaskDto.assignedToId === null) {
        assignedTo = undefined;
      } else {
        const foundUser = await this.userRepository.findOne({
          where: { id: updateTaskDto.assignedToId },
        });

        if (!foundUser) {
          throw new NotFoundException(
            `User with ID ${updateTaskDto.assignedToId} not found`,
          );
        }
        assignedTo = foundUser;
      }
    }

    // Exclude projectId and assignedToId from the update data since they're relations, not columns
    const { projectId, assignedToId, ...updateData } = updateTaskDto;

    Object.assign(task, {
      ...updateData,
      project: project || undefined,
      assignedTo: assignedTo || undefined,
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
