import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { getMarketPriceHandler, getMarketHistoryHandler } from "../controllers/marketController";

export default async function marketRoutes(server: FastifyInstance) {
  const authenticateOpts: RouteShorthandOptions = {
    preHandler: [server.authenticate],
  };

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
