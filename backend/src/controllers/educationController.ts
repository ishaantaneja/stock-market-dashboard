import { FastifyRequest, FastifyReply } from "fastify";
import * as educationService from "../services/educationService";

// Controller for educational content.
export async function getArticles(req: FastifyRequest, reply: FastifyReply) {
  try {
    const articles = await educationService.getAllArticles();
    return reply.send(articles);
  } catch (err: any) {
    req.log.error(err);
    return reply.status(500).send({ error: "Failed to fetch articles" });
  }
}

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
