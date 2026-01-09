import { Controller, Get, All, Req } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request } from 'express';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @All('echo')
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
