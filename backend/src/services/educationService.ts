import prisma from "../db/prismaClient";

// A simple data access layer for educational content.
export async function getAllArticles() {
  return prisma.education.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getArticleById(id: number) {
  return prisma.education.findUnique({
    where: { id },
  });
}

export async function createDummyArticles() {
  // This is a dummy function for seeding the database with content.
  // In a real-world scenario, you would have a separate seeding script.
  const articles = [
    {
      title: "Introduction to Stock Markets",
      content: "Stocks represent a share of ownership in a corporation. When you buy a company's stock, you become a part-owner of that company...",
    },
    {
      title: "Understanding Bull and Bear Markets",
      content: "A bull market is a period where stock prices are rising. A bear market is the opposite, characterized by falling prices...",
    },
    {
      title: "The Power of Compounding",
      content: "Compounding is the process where your investments generate earnings, and those earnings are reinvested to generate their own earnings...",
    },
  ];
  
  // The 'skipDuplicates' property is not supported by the SQLite provider.
  // We'll use a try...catch block to handle the unique constraint error
  // that would occur if the articles already exist.
  try {
    await prisma.education.createMany({
      data: articles,
    });
  } catch (error) {
    // If the error is a unique constraint failure, we can safely ignore it.
    // Otherwise, we re-throw the error.
    if (error instanceof Error && !error.message.includes("Unique constraint failed")) {
      throw error;
    }
  }
}
