// src/routes/marketRoutes.ts
import { FastifyInstance } from "fastify";
import { getPrice, getHistory } from "../controllers/marketController";

export async function marketRoutes(server: FastifyInstance) {
  // Public market endpoints (no auth)
  server.get("/price/:symbol", getPrice);           // GET /market/price/:symbol
  server.get("/history/:symbol", getHistory);       // GET /market/history/:symbol?days=30
}
