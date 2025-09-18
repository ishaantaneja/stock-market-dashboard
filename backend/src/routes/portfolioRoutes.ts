import { FastifyInstance } from "fastify";
import {
  getPortfolioHandler,
  createPortfolioHandler,
  tradeStockHandler,
  getPortfolioAnalyticsHandler,
} from "../controllers/portfolioController";

export default async function portfolioRoutes(server: FastifyInstance) {
  // use the server.authenticate decorator everywhere
  server.addHook("preHandler", server.authenticate);

  server.get("/portfolio", getPortfolioHandler);
  server.post("/portfolio", createPortfolioHandler);
  server.post("/portfolio/:id/trade", tradeStockHandler);
  server.get("/portfolio/:id/analytics", getPortfolioAnalyticsHandler);
}
