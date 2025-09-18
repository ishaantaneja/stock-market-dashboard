import { FastifyInstance } from "fastify";

// This is a placeholder for future WebSocket implementation.
// It can be used to broadcast real-time data like stock price updates.
// You'll need to install the Fastify WebSocket plugin: `pnpm install @fastify/websocket`.
export function setupWebsocket(server: FastifyInstance) {
  // server.register(require("@fastify/websocket"));

  // server.get("/ws", { websocket: true }, (conn, req) => {
  //   console.log("Client connected via WebSocket");
  //   conn.socket.on("message", (message) => {
  //     // Handle incoming messages
  //     conn.socket.send(`Echo: ${message}`);
  //   });
  //   conn.socket.on("close", () => {
  //     console.log("Client disconnected");
  //   });
  // });
}
