import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TasksService } from "./tasks.service";
import { Task } from "./entities/task.entity";
import { Project } from "../projects/entities/project.entity";

describe("TasksService", () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let projectRepository: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: {} },
        { provide: getRepositoryToken(Project), useValue: {} },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    projectRepository = module.get<Repository<Project>>(
      getRepositoryToken(Project),
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
