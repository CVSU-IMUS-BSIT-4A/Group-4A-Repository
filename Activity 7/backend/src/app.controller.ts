import { Controller, Get, All, Req } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { Request } from "express";
import axios from "axios";

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

  @All('echo')
  @ApiOperation({ summary: "Echo endpoint - forwards to Postman Echo" })
  async echo(@Req() request: Request) {
    try {
      const response = await axios({
        method: request.method as any,
        url: `https://postman-echo.com${request.url.replace('/echo', '')}`,
        headers: request.headers,
        data: request.body,
        params: request.query,
      });
      return response.data;
    } catch (error) {
      return {
        error: error.message,
        method: request.method,
        url: request.url,
        headers: request.headers,
      };
    }
  }
}
