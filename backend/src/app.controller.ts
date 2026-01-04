import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller()
@ApiTags('root')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Get API information' })
  getApiInfo() {
    return {
      message: 'Task Management API',
      version: '1.0',
      documentation: '/api',
      endpoints: {
        projects: '/projects',
        tasks: '/tasks',
        swagger: '/api',
      },
    };
  }
}
