import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MarketService } from '../../services/market';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './portfolio.html',
})
export class Portfolio implements OnInit {
  holdings = signal<{symbol: string, shares: number, price?: number}[]>([]);

  constructor(private http: HttpClient, private market: MarketService) {}

  ngOnInit() {
    this.http.get<{holdings: {symbol: string, shares: number}[]}>('http://localhost:3000/portfolio')
      .subscribe(res => {
        this.holdings.set(res.holdings);
        this.trackPrices();
      });
  }

  trackPrices() {
    this.holdings().forEach((h, idx) => {
      this.market.getPrice(h.symbol).subscribe((res: any) => {
        const copy = [...this.holdings()];
        copy[idx].price = res.price;
        this.holdings.set(copy);
      });
    });
  }
}
