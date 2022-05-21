import { Controller, Get, Sse } from '@nestjs/common';
import { interval, mergeMap, Observable, of } from 'rxjs';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('info')
  info(): Observable<any> {
    return of(this.appService.getInformation());
  }

  @Sse('watch')
  watch(): Observable<any> {
    return interval(1000).pipe(mergeMap(() => this.appService.getStats()));
  }
}
