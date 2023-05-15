import {Component, NgZone} from '@angular/core';
import {catchError, EMPTY, map, Observable, shareReplay, switchMap, take, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public url$: Observable<URL>;
  public info$: Observable<any>;
  public watch$: Observable<any>;

  public year: number = new Date().getFullYear();
  public url: string = window.location.hostname;

  public infoLoading: boolean = true;
  public infoError: Error | null = null;
  public watchLoading: boolean = true;
  public watchError: Error | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly zone: NgZone,
  ) {
    this.url$ = this.http.get('assets/config.json').pipe(
      map((config: any) => new URL(config['url'])),
      shareReplay(1),
    );

    this.info$ = this.url$.pipe(
      map((url) => new URL('info', url).href),
      switchMap((url) => this.http.get(url)),
      take(1),
      tap(() => (this.infoLoading = false)),
      catchError((error) => {
        this.infoLoading = false;
        this.infoError = error;

        return EMPTY;
      }),
    );

    this.watch$ = this.url$.pipe(
      map((url) => new URL('watch', url).href),
      switchMap((url) => new Observable<any>(subscriber => {
        const source = new EventSource(url);

        source.onmessage = event => {
          this.zone.run(() => subscriber.next(JSON.parse(event.data)));
        };

        source.onerror = error => {
          this.zone.run(() => subscriber.error(error));
        };
      })),
      tap(() => (this.watchLoading = false)),
      catchError((error) => {
        this.watchLoading = false;
        this.watchError = error;

        return EMPTY;
      }),
    );
  }

  public getUptime(n: number): {days: number, hours: number, minutes: number, seconds: number} {
    n = Math.ceil(n);

    const days = Math.floor(n / 24 / 60 / 60);
    n = n - (days * 24 * 60 * 60);

    const hours = Math.floor(n / 60 / 60);
    n = n - (hours * 60 * 60);

    const minutes: number = Math.floor(n / 60);
    const seconds: number = n % 60;

    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    }
  }

  public getColor(n: number): string {
    if (n >= 90) {
      return 'danger';
    }

    if (n >= 50) {
      return 'warning';
    }

    return 'success';
  }
}
