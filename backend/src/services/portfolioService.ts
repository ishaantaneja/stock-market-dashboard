import prisma from "../db/prismaClient";
import { TradeRequest } from "../models/portfolio";
import { getMarketPrice } from "./marketService";

export async function getPortfolios(userId: number) {
  return prisma.portfolio.findMany({
    where: { userId },
    include: { positions: true },
  });
}

export async function createPortfolio(userId: number, name: string) {
  return prisma.portfolio.create({
    data: {
      userId,
      name,
    },
  });
}

export async function tradeStock(
  userId: number,
  portfolioId: number,
  trade: TradeRequest
) {
  const { stockSymbol, action, quantity, price } = trade;
  const currentPrice = price ?? (await getMarketPrice(stockSymbol)).price;

  return prisma.$transaction(async (tx) => {
    let position = await tx.position.findFirst({
      where: { portfolioId, stockSymbol },
    });

    if (action === "BUY") {
      if (position) {
        const totalCost =
          position.avgPrice * position.quantity + currentPrice * quantity;
        const newQty = position.quantity + quantity;
        const newAvgPrice = totalCost / newQty;

        position = await tx.position.update({
          where: { id: position.id },
          data: { quantity: newQty, avgPrice: newAvgPrice },
        });
      } else {
        position = await tx.position.create({
          data: {
            portfolioId,
            stockSymbol,
            quantity,
            avgPrice: currentPrice,
          },
        });
      }
    } else if (action === "SELL") {
      if (!position || position.quantity < quantity) {
        throw new Error("Not enough shares to sell");
      }

      const newQty = position.quantity - quantity;

      if (newQty === 0) {
        await tx.position.delete({ where: { id: position.id } });
      } else {
        position = await tx.position.update({
          where: { id: position.id },
          data: { quantity: newQty },
        });
      }
    }

    const transaction = await tx.transaction.create({
      data: {
        userId,
        stockSymbol,
        action,
        quantity,
        price: currentPrice,
      },
    });

    return { position, transaction };
  });
}

export async function getPortfolioAnalytics(portfolioId: number) {
  const positions = await prisma.position.findMany({
    where: { portfolioId },
  });

  let totalInvested = 0;
  let totalValue = 0;

  for (const pos of positions) {
    const { price } = await getMarketPrice(pos.stockSymbol);
    totalInvested += pos.avgPrice * pos.quantity;
    totalValue += price * pos.quantity;
  }

  const pnl = totalValue - totalInvested;

  return { totalInvested, totalValue, pnl, positions };
}
