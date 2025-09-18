import { FastifyInstance } from "fastify";
import WebSocket from "ws";
import { getMarketPrice } from "../services/marketService";
import { createNotification } from "../services/notificationService";
import jwt from "jsonwebtoken";

interface WSClient extends WebSocket {
  user?: any;
}

interface Subscription {
  [symbol: string]: Set<WSClient>;
}

export function setupWebsocket(server: FastifyInstance) {
  const wss = new WebSocket.Server({ noServer: true });
  const subscriptions: Subscription = {};

  server.server.on("upgrade", (req, socket, head) => {
    if (!req.url?.startsWith("/ws")) return;

    wss.handleUpgrade(req, socket, head, (ws) => {
      const token = new URL(req.url!, "http://localhost").searchParams.get("token");
      let user = null;
      if (token) {
        try {
          user = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
        } catch {
          ws.close(1008, "Invalid token");
          return;
        }
      }
      (ws as WSClient).user = user;
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws: WSClient) => {
    ws.on("message", async (msg) => {
      try {
        const { symbol, notifyTrade } = JSON.parse(msg.toString());
        if (!symbol) return;

        // Subscribe client to symbol updates
        if (!subscriptions[symbol]) subscriptions[symbol] = new Set();
        subscriptions[symbol].add(ws);

        // Send initial price immediately
        const priceData = await getMarketPrice(symbol);
        ws.send(JSON.stringify({ type: "priceUpdate", data: priceData }));

        // Optional: trade notification
        if (notifyTrade && ws.user) {
          const notification = await createNotification(ws.user.id, `Trade executed: ${notifyTrade}`);
          ws.send(JSON.stringify({ type: "tradeNotification", data: notification }));
        }
      } catch (err) {
        ws.send(JSON.stringify({ error: "Invalid request" }));
      }
    });

    ws.on("close", () => {
      // Remove from all subscriptions
      Object.values(subscriptions).forEach(set => set.delete(ws));
    });
  });

  // Broadcast loop: update all subscribed symbols every 1s
  setInterval(async () => {
    for (const symbol of Object.keys(subscriptions)) {
      if (subscriptions[symbol].size === 0) continue;
      try {
        const priceData = await getMarketPrice(symbol);
        subscriptions[symbol].forEach(ws => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "priceUpdate", data: priceData }));
          }
        });
      } catch (err) {
        console.error(`Failed to fetch price for ${symbol}:`, err);
      }
    }
  }, 1000);

  console.log("✅ WebSocket server initialized on /ws");
}
