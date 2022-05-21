import {Component, NgZone} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  info$: Observable<any> | null = null;
  watch$: Observable<any> | null = null;

  year = new Date().getFullYear();

  constructor(private http: HttpClient, private zone: NgZone) {
    this.info$ = http.get(`http://${window.location.hostname}:3000/info`);

    this.watch$ = new Observable<any>(subscriber => {
      const source = new EventSource(`http://${window.location.hostname}:3000/watch`);

      source.onmessage = event => {
        this.zone.run(() => subscriber.next(JSON.parse(event.data)));
      };

      source.onerror = error => {
        this.zone.run(() => subscriber.error(error));
      };
    });
  }
}
