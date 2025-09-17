// src/services/portfolioService.ts
import { prisma } from "../db/prismaClient";

interface TradeData {
  stockSymbol: string;
  action: "BUY" | "SELL";
  quantity: number;
  price: number;
}

// Get all portfolios for a user
export async function getAllPortfolios(userId: number) {
  return prisma.portfolio.findMany({
    where: { userId },
    include: { positions: true },
    orderBy: { createdAt: "desc" },
  });
}

// Create new portfolio for user
export async function createNewPortfolio(name: string, userId: number) {
  return prisma.portfolio.create({
    data: { name, userId },
    include: { positions: true },
  });
}

// Execute a trade: update Positions + create Transaction (atomic, auth checked)
export async function executeTrade(userId: number, portfolioId: number, trade: TradeData) {
  const { stockSymbol, action, quantity, price } = trade;

  // ensure portfolio exists and belongs to user
  const portfolio = await prisma.portfolio.findUnique({ where: { id: portfolioId } });
  if (!portfolio || portfolio.userId !== userId) {
    throw new Error("Portfolio not found or unauthorized");
  }

  return prisma.$transaction(async (tx) => {
    // find current position inside transaction
    let position = await tx.position.findFirst({
      where: { portfolioId, stockSymbol },
    });

    if (action === "BUY") {
      if (position) {
        const totalQty = position.quantity + quantity;
        const totalCost = position.avgPrice * position.quantity + price * quantity;
        const newAvgPrice = totalCost / totalQty;

        position = await tx.position.update({
          where: { id: position.id },
          data: { quantity: totalQty, avgPrice: newAvgPrice },
        });
      } else {
        position = await tx.position.create({
          data: { portfolioId, stockSymbol, quantity, avgPrice: price },
        });
      }
    } else if (action === "SELL") {
      if (!position || position.quantity < quantity) {
        throw new Error("Not enough shares to sell");
      }

      const newQty = position.quantity - quantity;
      if (newQty === 0) {
        await tx.position.delete({ where: { id: position.id } });
        position = null as any;
      } else {
        position = await tx.position.update({
          where: { id: position.id },
          data: { quantity: newQty },
        });
      }
    } else {
      throw new Error("Invalid action");
    }

    // create transaction record
    const transaction = await tx.transaction.create({
      data: { userId, stockSymbol, action, quantity, price },
    });

    return { position, transaction };
  });
}

// Get portfolio analytics: total invested, current value (currently uses avgPrice; can plug market API)
export async function getPortfolioAnalytics(userId: number, portfolioId: number) {
  const portfolio = await prisma.portfolio.findUnique({ where: { id: portfolioId } });
  if (!portfolio || portfolio.userId !== userId) {
    throw new Error("Portfolio not found or unauthorized");
  }

  const positions = await prisma.position.findMany({
    where: { portfolioId },
  });

  const totalInvested = positions.reduce((acc, p) => acc + p.avgPrice * p.quantity, 0);

  // TODO: call market API to get real current price per symbol to compute real totalValue
  const totalValue = totalInvested;

  return { portfolioId, totalInvested, totalValue, positions };
}
