import { FastifyRequest, FastifyReply } from "fastify";
import * as notificationsService from "../services/notificationsService";

// Controller for user notifications.
export async function getNotifications(req: FastifyRequest, reply: FastifyReply) {
  const userId = (req.user as any)?.id;
  if (!userId) return reply.status(401).send({ error: "Unauthorized" });

  try {
    const notifications = await notificationsService.getNotificationsForUser(userId);
    return reply.send(notifications);
  } catch (err: any) {
    req.log.error(err);
    return reply.status(500).send({ error: "Failed to fetch notifications" });
  }
}

export async function markAsRead(
  req: FastifyRequest<{ Body: { ids: number[] } }>,
  reply: FastifyReply
) {
  const userId = (req.user as any)?.id;
  if (!userId) return reply.status(401).send({ error: "Unauthorized" });

  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return reply.status(400).send({ error: "IDs must be an array" });
  }

  try {
    await notificationsService.markNotificationsAsRead(userId, ids);
    return reply.send({ message: "Notifications marked as read" });
  } catch (err: any) {
    req.log.error(err);
    return reply.status(500).send({ error: "Failed to mark notifications as read" });
  }
}
