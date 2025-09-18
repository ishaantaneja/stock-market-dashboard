import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { getMarketPriceHandler, getMarketHistoryHandler } from "../controllers/marketController";

// Optional: you can type auth if you want
const authenticateOpts: RouteShorthandOptions = {
  preValidation: [async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: "Unauthorized" });
    }
  }],
};

export default async function marketRoutes(server: FastifyInstance) {
  // Routes
  server.get<{ Params: { symbol: string } }>(
    "/price/:symbol",
    authenticateOpts,
    getMarketPriceHandler
  );

  server.get<{ Params: { symbol: string }; Querystring: { range?: string } }>(
    "/history/:symbol",
    authenticateOpts,
    getMarketHistoryHandler
  );
}
