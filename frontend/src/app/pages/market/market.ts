import { Component, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketService } from '../../services/market';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './market.html',
})
export class Market {
  symbol = signal('');
  price = signal<number | null>(null);

  constructor(private market: MarketService) {}

  search() {
    if (!this.symbol()) return;
    this.market.getPrice(this.symbol()).subscribe(res => {
      this.price.set(res.price);
    });
  }
}
