import {Component, NgZone} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public info$: Observable<any> | null = null;
  public watch$: Observable<any> | null = null;

  public year: number = new Date().getFullYear();
  public url: string = window.location.hostname;

  public constructor(private http: HttpClient, private zone: NgZone) {
    this.info$ = http.get(`http://${this.url}:3000/info`);

    this.watch$ = new Observable<any>(subscriber => {
      const source = new EventSource(`http://${this.url}:3000/watch`);

      source.onmessage = event => {
        this.zone.run(() => subscriber.next(JSON.parse(event.data)));
      };

      source.onerror = error => {
        this.zone.run(() => subscriber.error(error));
      };
    });
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
