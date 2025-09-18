import { Component, OnInit, OnDestroy } from '@angular/core';
import { WSClient } from '../../core/ws-client';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private wsClient!: WSClient;

  ngOnInit() {
    const token = localStorage.getItem('token') || '';
    this.wsClient = new WSClient(token);

    // Subscribe to a stock
    this.wsClient.subscribe('AAPL');
    this.wsClient.subscribe('TSLA');
  }

  ngOnDestroy() {
    this.wsClient.close();
  }
}
