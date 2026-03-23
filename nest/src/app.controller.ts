import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { message: string } {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { ok: boolean } {
    return this.appService.getHealth();
  }

  @Post('echo')
  echo(@Body() body: { message: string }) {
    return this.appService.echo(body);
  }
}
