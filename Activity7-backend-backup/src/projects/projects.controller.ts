import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@ApiTags("projects")
@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new project" })
  @ApiResponse({ status: 201, description: "Project created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiBody({ type: CreateProjectDto })
  async create(@Body() createProjectDto: CreateProjectDto) {
    try {
      return await this.projectsService.create(createProjectDto);
    } catch (error) {
      throw new HttpException(
        "Failed to create project",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: "Get all projects" })
  @ApiResponse({ status: 200, description: "List of all projects" })
  async findAll() {
    try {
      return await this.projectsService.findAll();
    } catch (error) {
      throw new HttpException(
        "Failed to fetch projects",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a project by ID" })
  @ApiParam({ name: "id", type: "number", description: "Project ID" })
  @ApiResponse({ status: 200, description: "Project found" })
  @ApiResponse({ status: 404, description: "Project not found" })
  async findOne(@Param("id") id: string) {
    try {
      const project = await this.projectsService.findOne(+id);
      if (!project) {
        throw new HttpException("Project not found", HttpStatus.NOT_FOUND);
      }
      return project;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Failed to fetch project",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a project (full update)" })
  @ApiParam({ name: "id", type: "number", description: "Project ID" })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ status: 200, description: "Project updated successfully" })
  @ApiResponse({ status: 404, description: "Project not found" })
  async update(
    @Param("id") id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    try {
      const project = await this.projectsService.update(+id, updateProjectDto);
      if (!project) {
        throw new HttpException("Project not found", HttpStatus.NOT_FOUND);
      }
      return project;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Failed to update project",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(":id")
  @ApiOperation({ summary: "Partially update a project" })
  @ApiParam({ name: "id", type: "number", description: "Project ID" })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ status: 200, description: "Project updated successfully" })
  @ApiResponse({ status: 404, description: "Project not found" })
  async patch(
    @Param("id") id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    try {
      const project = await this.projectsService.update(+id, updateProjectDto);
      if (!project) {
        throw new HttpException("Project not found", HttpStatus.NOT_FOUND);
      }
      return project;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Failed to update project",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a project" })
  @ApiParam({ name: "id", type: "number", description: "Project ID" })
  @ApiResponse({ status: 200, description: "Project deleted successfully" })
  async remove(@Param("id") id: string) {
    try {
      await this.projectsService.remove(+id);
      return { message: "Project deleted successfully" };
    } catch (error) {
      throw new HttpException(
        "Failed to delete project",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
