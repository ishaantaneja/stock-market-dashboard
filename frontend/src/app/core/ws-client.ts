export interface PriceUpdate {
  type: "priceUpdate";
  data: {
    symbol: string;
    price: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
    timestamp: number;
  };
}

export interface TradeNotification {
  type: "tradeNotification";
  data: {
    id: number;
    userId: number;
    message: string;
    read: boolean;
    createdAt: string;
  };
}

export class WSClient {
  private ws: WebSocket | null = null;
  private subscriptions: Set<string> = new Set();
  private url: string;
  private token: string;

  constructor(token: string) {
    this.token = token;
    this.url = `ws://localhost:4000/ws?token=${token}`;
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("🟢 WS connected");
      // Resubscribe to all previous symbols
      this.subscriptions.forEach(symbol => this.subscribe(symbol));
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
          case "priceUpdate":
            console.log("📈 Price update:", msg.data);
            break;
          case "tradeNotification":
            console.log("🔔 Trade notification:", msg.data);
            break;
          default:
            console.warn("Unknown message:", msg);
        }
      } catch (err) {
        console.error("Invalid WS message:", err);
      }
    };

    this.ws.onclose = () => {
      console.log("🔴 WS disconnected, retrying in 2s...");
      setTimeout(() => this.connect(), 2000);
    };

    this.ws.onerror = (err) => {
      console.error("⚠️ WS error:", err);
      this.ws?.close();
    };
  }

  subscribe(symbol: string, notifyTrade?: string) {
    this.subscriptions.add(symbol);
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ symbol, notifyTrade }));
    }
  }

  unsubscribe(symbol: string) {
    this.subscriptions.delete(symbol);
    // Note: server auto-removes disconnected clients, no explicit unsubscribe needed
  }

  close() {
    this.ws?.close();
  }
}
