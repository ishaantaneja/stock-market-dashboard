import { FastifyInstance } from "fastify";
import { getNotifications, markAsRead } from "../controllers/notificationsController";

export async function notificationsRoutes(server: FastifyInstance) {
  server.addHook("preHandler", async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
  });

  server.get("/", getNotifications); // GET /notifications
  server.post("/mark-read", markAsRead); // POST /notifications/mark-read
}
