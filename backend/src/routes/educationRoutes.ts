import { FastifyInstance } from "fastify";
import { getArticles, getArticleById } from "../controllers/educationController";

export async function educationRoutes(server: FastifyInstance) {
  // GET /education?page=1&limit=5
  server.get("/", getArticles);

  // GET /education/:id
  server.get("/:id", getArticleById);
}
