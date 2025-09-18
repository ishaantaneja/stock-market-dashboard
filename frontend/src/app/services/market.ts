import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MarketService {
  private base = 'http://localhost:4000/market';

  constructor(private http: HttpClient) {}

  getPrice(symbol: string): Observable<any> {
    // naive short-polling every 5s
    return timer(0, 5000).pipe(
      switchMap(() => this.http.get(`${this.base}/price/${symbol}`))
    );
  }
}
