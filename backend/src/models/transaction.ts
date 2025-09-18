export interface Transaction {
  id: string;
  portfolioId: string;
  symbol: string;
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
  createdAt: Date;
}
