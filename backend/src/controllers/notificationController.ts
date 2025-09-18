import { FastifyReply, FastifyRequest } from "fastify";
import { getNotifications, markAsRead } from "../services/notificationService";
import { Notification } from "../models/notification";

interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: number;
    email: string;
  };
}

/**
 * The controller for handling all notification-related API requests.
 * It manages the request-response cycle and delegates business logic to the service.
 */

/**
 * Handles the GET /notifications request to list all notifications for the current user.
 * @param request The incoming Fastify request object.
 * @param reply The Fastify reply object.
 */
export async function getNotificationsHandler(request: AuthenticatedRequest, reply: FastifyReply) {
  try {
    const userId = request.user.id;
    // An optional query parameter 'filterBy' can be used to get unread notifications.
    const { filterBy } = request.query as { filterBy?: 'unread' };
    const notifications = await getNotifications(userId, filterBy);
    reply.status(200).send(notifications);
  } catch (error) {
    if (error instanceof Error) {
      reply.status(500).send({ message: error.message });
    }
    reply.status(500).send({ message: "An unexpected error occurred" });
  }
}

/**
 * Handles the PUT /notifications/:id/read request to mark a notification as read.
 * @param request The incoming Fastify request object.
 * @param reply The Fastify reply object.
 */
export async function markAsReadHandler(request: AuthenticatedRequest, reply: FastifyReply) {
  try {
    const userId = request.user.id;
    const { id } = request.params as { id: string };

    const updatedNotification = await markAsRead(userId, parseInt(id));

    if (!updatedNotification) {
      reply.status(404).send({ message: "Notification not found or unauthorized" });
      return;
    }

    reply.status(200).send(updatedNotification);
  } catch (error) {
    if (error instanceof Error) {
      reply.status(500).send({ message: error.message });
    }
    reply.status(500).send({ message: "An unexpected error occurred" });
  }
}
