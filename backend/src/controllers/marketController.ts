import { FastifyReply, FastifyRequest } from "fastify";
import { getMarketPrice, getMarketHistory } from "../services/marketService";

export async function getMarketPriceHandler(
  req: FastifyRequest<{ Params: { symbol: string } }>,
  reply: FastifyReply
) {
  try {
    const { symbol } = req.params;
    const price = await getMarketPrice(symbol);
    reply.send(price);
  } catch (err: any) {
    reply.status(500).send({ error: err.message });
  }
}

export async function getMarketHistoryHandler(
  req: FastifyRequest<{ Params: { symbol: string }; Querystring: { range?: string } }>,
  reply: FastifyReply
) {
  try {
    const { symbol } = req.params;
    const { range = "1m" } = req.query;
    const history = await getMarketHistory(symbol, range);
    reply.send(history);
  } catch (err: any) {
    reply.status(500).send({ error: err.message });
  }
}
