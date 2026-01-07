import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AppService } from "./app.service";

@Controller()
@ApiTags("root")
export class AppController {
  constructor(private readonly appService: AppService) {}

  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  @ApiOperation({ summary: "Get API information" })
  getApiInfo() {
    return {
      message: "Task Management API",
      version: "1.0",
      documentation: "/api",
      endpoints: {
        projects: "/projects",
        tasks: "/tasks",
        swagger: "/api",
      },
    };
  }
}
