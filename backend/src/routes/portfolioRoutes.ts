import { FastifyInstance } from "fastify";
import { getPortfolioHandler, createPortfolioHandler, tradeStockHandler, getPortfolioAnalyticsHandler } from "../controllers/portfolioController";

export default async function portfolioRoutes(server: FastifyInstance) {
  server.addHook("onRequest", async (req, reply) => {
    try { await req.jwtVerify(); } 
    catch (err) { reply.status(401).send({ error: "Unauthorized" }); }
  });

  server.get("/portfolio", getPortfolioHandler);
  server.post("/portfolio", createPortfolioHandler);
  server.post("/portfolio/:id/trade", tradeStockHandler);
  server.get("/portfolio/:id/analytics", getPortfolioAnalyticsHandler);
}
