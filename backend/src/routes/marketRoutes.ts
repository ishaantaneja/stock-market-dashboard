// backend/src/routes/marketRoutes.ts
import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { getMarketPriceHandler, getMarketHistoryHandler } from "../controllers/marketController";

export default async function marketRoutes(server: FastifyInstance) {
  const authenticateOpts: RouteShorthandOptions = {
    preHandler: [server.authenticate],
  };

  // GET /market/price/:symbol
  server.get<{ Params: { symbol: string } }>(
    "/price/:symbol",
    authenticateOpts,
    getMarketPriceHandler
  );

  // GET /market/history/:symbol?range=...
  server.get<{ Params: { symbol: string }; Querystring: { range?: string } }>(
    "/history/:symbol",
    authenticateOpts,
    getMarketHistoryHandler
  );
}
