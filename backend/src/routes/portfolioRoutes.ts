// src/routes/portfolioRoutes.ts
import { FastifyInstance } from "fastify";
import { getPortfolios, createPortfolio, trade, getAnalytics } from "../controllers/portfolioController";

export async function portfolioRoutes(server: FastifyInstance) {
  // all portfolio routes require authentication
  server.addHook("preHandler", async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
  });

  // handlers are controller functions (they receive req, reply)
  server.get("/", getPortfolios);
  server.post("/", createPortfolio);
  server.post("/:id/trade", trade);
  server.get("/:id/analytics", getAnalytics);
}
