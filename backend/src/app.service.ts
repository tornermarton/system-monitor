import { Injectable } from '@nestjs/common';
import * as si from 'systeminformation';

@Injectable()
export class AppService {
  async getInformation(): Promise<any> {
    return await si.get({
      time: '*',
      system: '*',
      cpu: '*',
      currentLoad: 'cpus',
      mem: '*',
      memLayout: '*',
      graphics: 'controllers',
      networkInterfaces: '*',
    });
  }

  async getStats(): Promise<any> {
    return {
      data: await si.get({
        time: '*',
        cpu: '*',
        currentLoad: 'cpus',
        mem: '*',
        graphics: 'controllers',
        networkStats: '*',
        networkConnections: '*',
      }),
    };
  }
}
