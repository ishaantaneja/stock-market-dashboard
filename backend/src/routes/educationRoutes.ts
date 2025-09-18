import { FastifyInstance } from "fastify";
import { getArticles, getArticleById } from "../controllers/educationController";

export async function educationRoutes(server: FastifyInstance) {
  server.get("/", getArticles); // GET /education
  server.get("/:id", getArticleById); // GET /education/:id
}
