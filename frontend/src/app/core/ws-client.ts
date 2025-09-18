export class WSClient {
  private ws!: WebSocket;

  constructor(private token: string) {}

  connect() {
    this.ws = new WebSocket(`ws://localhost:4000/ws?token=${this.token}`);

    this.ws.onopen = () => console.log("✅ WS Connected");
    this.ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "priceUpdate") {
        console.log("Price update:", data.data);
      } else if (data.type === "tradeNotification") {
        console.log("Trade notification:", data.data);
      }
    };

    this.ws.onclose = () => console.log("⚠️ WS Disconnected");
  }

  requestPrice(symbol: string, notifyTrade?: string) {
    this.ws.send(JSON.stringify({ symbol, notifyTrade }));
  }
}
