// src/controllers/portfolioController.ts
import { FastifyRequest, FastifyReply } from "fastify";
import {
  getAllPortfolios,
  createNewPortfolio,
  executeTrade,
  getPortfolioAnalytics,
} from "../services/portfolioService";

export async function getPortfolios(req: FastifyRequest, reply: FastifyReply) {
  const userId = (req.user as any)?.id;
  if (!userId) return reply.status(401).send({ error: "Unauthorized" });

  const portfolios = await getAllPortfolios(userId);
  return reply.send(portfolios);
}

export async function createPortfolio(
  req: FastifyRequest<{ Body: { name?: string } }>,
  reply: FastifyReply
) {
  const userId = (req.user as any)?.id;
  if (!userId) return reply.status(401).send({ error: "Unauthorized" });

  const { name } = req.body ?? {};
  const portfolio = await createNewPortfolio(name ?? "My Portfolio", userId);
  return reply.status(201).send(portfolio);
}

export async function trade(
  req: FastifyRequest<{
    Params: { id: string };
    Body: { stockSymbol: string; action: "BUY" | "SELL"; quantity: number; price: number };
  }>,
  reply: FastifyReply
) {
  const userId = (req.user as any)?.id;
  if (!userId) return reply.status(401).send({ error: "Unauthorized" });

  const portfolioId = Number(req.params.id);
  try {
    const result = await executeTrade(userId, portfolioId, req.body);
    return reply.send(result);
  } catch (err: any) {
    // known error messages (e.g., not enough shares, unauthorized)
    return reply.status(400).send({ error: err.message ?? "Trade failed" });
  }
}

export async function getAnalytics(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const userId = (req.user as any)?.id;
  if (!userId) return reply.status(401).send({ error: "Unauthorized" });

  const portfolioId = Number(req.params.id);
  const analytics = await getPortfolioAnalytics(userId, portfolioId);
  return reply.send(analytics);
}
