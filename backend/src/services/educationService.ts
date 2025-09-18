export interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

// Demo seed data
const articles: Article[] = [
  { id: 1, title: "Intro to Stocks", content: "Learn the basics of stock market.", createdAt: "2025-09-18" },
  { id: 2, title: "Technical Analysis", content: "Understanding charts and indicators.", createdAt: "2025-09-18" },
  { id: 3, title: "Risk Management", content: "How to protect your portfolio.", createdAt: "2025-09-18" },
  { id: 4, title: "Long-term Investing", content: "Grow wealth steadily over years.", createdAt: "2025-09-18" },
  { id: 5, title: "Day Trading Basics", content: "Quick trades for short-term gains.", createdAt: "2025-09-18" },
  { id: 6, title: "Market Psychology", content: "Understanding investor behavior.", createdAt: "2025-09-18" },
  // ... add more articles as needed
];

/**
 * Get a paginated list of articles
 * @param offset number of items to skip
 * @param limit number of items to return
 */
export async function getArticles(offset: number, limit: number): Promise<Article[]> {
  return articles.slice(offset, offset + limit);
}

/**
 * Get single article by ID
 * @param id article ID
 */
export async function getArticleById(id: number): Promise<Article | undefined> {
  return articles.find((a) => a.id === id);
}
