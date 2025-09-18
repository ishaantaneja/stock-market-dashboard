export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
}

export interface TradeRequest {
  stockSymbol: string;
  action: "BUY" | "SELL";
  quantity: number;
  price: number;
}
