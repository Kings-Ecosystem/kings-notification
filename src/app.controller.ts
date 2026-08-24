/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('healthz')
  liveness() {
    return { status: 'ok', service: 'kings-notification' };
  }

  @Get('readyz')
  readiness() {
    return { status: 'ready', service: 'kings-notification' };
  }
}
