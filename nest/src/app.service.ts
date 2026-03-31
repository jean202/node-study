import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return { ok: true };
  }

  getHello() {
    return { message: 'Hello NestJS!' };
  }

  echo(body: { message: string }) {
    return body;
  }
}
