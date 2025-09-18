import { FastifyInstance } from "fastify";
import WebSocket from "ws";
import { getMarketPrice } from "../services/marketService";
import { createNotification } from "../services/notificationService";
import jwt from "jsonwebtoken";

export function setupWebsocket(server: FastifyInstance) {
  const wss = new WebSocket.Server({ noServer: true });

  server.server.on("upgrade", (request, socket, head) => {
    if (request.url?.startsWith("/ws")) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        // Attach user info if token is present
        const token = new URL(request.url!, "http://localhost").searchParams.get("token");
        let user: any = null;
        if (token) {
          try {
            user = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
          } catch {
            ws.close(1008, "Invalid token");
            return;
          }
        }
        (ws as any).user = user;
        wss.emit("connection", ws, request);
      });
    }
  });

  wss.on("connection", (ws) => {
    ws.on("message", async (msg) => {
      try {
        const { symbol, notifyTrade } = JSON.parse(msg.toString());

        // Send current price
        const priceData = await getMarketPrice(symbol);
        ws.send(JSON.stringify({ type: "priceUpdate", data: priceData }));

        // Optionally push a trade notification
        if (notifyTrade && (ws as any).user) {
          const notification = await createNotification(
            (ws as any).user.id,
            `Trade executed: ${notifyTrade}`
          );
          ws.send(JSON.stringify({ type: "tradeNotification", data: notification }));
        }
      } catch (err) {
        ws.send(JSON.stringify({ error: "Invalid request" }));
      }
    });
  });

  console.log("✅ WebSocket server initialized on /ws");
}
