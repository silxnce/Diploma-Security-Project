import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      status: 'ok',
      message: 'Backend працює.',
      timestamp: new Date().toISOString(),
    };
  }
}
