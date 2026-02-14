import { Injectable } from '@nestjs/common';

type HealthcheckResponse = {
  status: 'ok';
  timestamp: string;
  uptime: number;
};

@Injectable()
export class AppService {
  getHealthcheck(): HealthcheckResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
