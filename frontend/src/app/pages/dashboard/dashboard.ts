import { Component, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MarketService } from '../../services/market';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  stocks = signal<{symbol: string, price: number}[]>([
    { symbol: 'AAPL', price: 0 },
    { symbol: 'TSLA', price: 0 }
  ]);

  constructor(private market: MarketService) {}

  ngOnInit() {
    this.stocks().forEach((stock, idx) => {
      this.market.getPrice(stock.symbol).subscribe((res: any) => {
        const copy = [...this.stocks()];
        copy[idx].price = res.price;
        this.stocks.set(copy);
      });
    });
  }
}
