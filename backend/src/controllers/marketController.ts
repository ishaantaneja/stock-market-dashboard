// src/controllers/marketController.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { fetchPrice, fetchHistory } from "../services/marketService";

export async function getPrice(
  req: FastifyRequest<{ Params: { symbol: string } }>,
  reply: FastifyReply
) {
  const symbol = req.params?.symbol;
  if (!symbol) return reply.status(400).send({ error: "symbol param required" });

  try {
    const data = await fetchPrice(symbol);
    return reply.send(data);
  } catch (err: any) {
    req.log?.error(err);
    return reply.status(502).send({ error: err.message ?? "Market provider error" });
  }
}

export async function getHistory(
  req: FastifyRequest<{ Params: { symbol: string }; Querystring: { days?: string } }>,
  reply: FastifyReply
) {
  const symbol = req.params?.symbol;
  if (!symbol) return reply.status(400).send({ error: "symbol param required" });

  const daysQs = (req.query as any)?.days;
  const days = daysQs ? Number(daysQs) : 365;

  if (Number.isNaN(days) || days < 0) return reply.status(400).send({ error: "days query must be a positive number" });

  try {
    const data = await fetchHistory(symbol, days);
    return reply.send(data);
  } catch (err: any) {
    req.log?.error(err);
    return reply.status(502).send({ error: err.message ?? "Market provider error" });
  }
}
