import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.position.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.user.deleteMany();
  await prisma.education.deleteMany();

  // Create a demo user
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      email: "demo@example.com",
      passwordHash,
    },
  });

  // Create a portfolio
  const portfolio = await prisma.portfolio.create({
    data: {
      userId: user.id,
      name: "My First Portfolio",
    },
  });

  // Add positions
  await prisma.position.createMany({
    data: [
      {
        portfolioId: portfolio.id,
        stockSymbol: "AAPL",
        quantity: 10,
        avgPrice: 150,
      },
      {
        portfolioId: portfolio.id,
        stockSymbol: "TSLA",
        quantity: 5,
        avgPrice: 700,
      },
    ],
  });

  // Add transactions
  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        stockSymbol: "AAPL",
        action: "BUY",
        quantity: 10,
        price: 150,
      },
      {
        userId: user.id,
        stockSymbol: "TSLA",
        action: "BUY",
        quantity: 5,
        price: 700,
      },
    ],
  });

  // Add notifications
  await prisma.notification.create({
    data: {
      userId: user.id,
      message: "Welcome to Stock Market Dashboard! 🎉",
    },
  });

  // Add education content
  await prisma.education.createMany({
    data: [
      {
        title: "What is a Stock?",
        content: "A stock represents a share in the ownership of a company.",
      },
      {
        title: "What is a Portfolio?",
        content: "A portfolio is a collection of investments held by an individual.",
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
