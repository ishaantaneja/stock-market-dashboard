import { FastifyRequest, FastifyReply } from "fastify";
import { getPortfolios, createPortfolio, tradeStock, getPortfolioAnalytics } from "../services/portfolioService";
import { TradeRequest } from "../models/portfolio";

export async function getPortfolioHandler(req: FastifyRequest, reply: FastifyReply) {
  const user = (req as any).user;
  const portfolios = await getPortfolios(user.id);
  reply.send(portfolios);
}

export async function createPortfolioHandler(req: FastifyRequest<{ Body: { name: string } }>, reply: FastifyReply) {
  const user = (req as any).user;
  const portfolio = await createPortfolio(user.id, req.body.name);
  reply.status(201).send(portfolio);
}

export async function tradeStockHandler(req: FastifyRequest<{ Params: { id: string }; Body: TradeRequest }>, reply: FastifyReply) {
  const user = (req as any).user;
  const portfolioId = parseInt(req.params.id, 10);
  const result = await tradeStock(user.id, portfolioId, req.body);
  reply.send(result);
}

export async function getPortfolioAnalyticsHandler(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const portfolioId = parseInt(req.params.id, 10);
  const analytics = await getPortfolioAnalytics(portfolioId);
  reply.send(analytics);
}
