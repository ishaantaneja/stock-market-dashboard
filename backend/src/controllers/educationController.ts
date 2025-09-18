import { FastifyRequest, FastifyReply } from "fastify";
import * as educationService from "../services/educationService";

// GET /education?page=X&limit=Y
export async function getArticles(
  req: FastifyRequest<{ Querystring: { page?: string; limit?: string } }>,
  reply: FastifyReply
) {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "5", 10);
    const offset = (page - 1) * limit;

    const articles = await educationService.getArticles(offset, limit); // new service method
    return reply.send({
      page,
      limit,
      data: articles,
    });
  } catch (err: any) {
    req.log.error(err);
    return reply.status(500).send({ error: "Failed to fetch articles" });
  }
}

// GET /education/:id
export async function getArticleById(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const articleId = parseInt(req.params.id, 10);
  if (isNaN(articleId)) {
    return reply.status(400).send({ error: "Invalid article ID" });
  }

  try {
    const article = await educationService.getArticleById(articleId);
    if (!article) {
      return reply.status(404).send({ error: "Article not found" });
    }
    return reply.send(article);
  } catch (err: any) {
    req.log.error(err);
    return reply.status(500).send({ error: "Failed to fetch article" });
  }
}
