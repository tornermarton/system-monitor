import { Injectable } from '@nestjs/common';
import * as si from 'systeminformation';

@Injectable()
export class AppService {
  async getInformation(): Promise<any> {
    return await si.get({
      time: '*',
      system: '*',
      cpu: '*',
      memLayout: '*',
      graphics: 'controllers',
      networkInterfaces: '*',
    });
  }

  async getStats(): Promise<any> {
    return await si.get({
      time: '*',
      cpu: '*',
      mem: '*',
      graphics: 'controllers',
      networkStats: '*',
      networkConnections: '*',
    });
  }
}
