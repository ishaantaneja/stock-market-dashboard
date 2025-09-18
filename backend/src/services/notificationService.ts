import prisma from "../db/prismaClient";
import { Notification } from "../models/notification";

/**
 * This service handles all business logic related to user notifications.
 * It is responsible for database operations and ensuring the data integrity
 * of notifications.
 */

/**
 * Fetches all notifications for a given user.
 * @param userId The ID of the user.
 * @param filterBy Optional filter to return only unread notifications.
 * @returns An array of notifications.
 */
export async function getNotifications(userId: number, filterBy?: 'unread'): Promise<Notification[]> {
  const whereClause: { userId: number; read?: boolean } = { userId };
  if (filterBy === 'unread') {
    whereClause.read = false;
  }

  return prisma.notification.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Marks a specific notification as read.
 * This function includes an important security check to prevent a user from
 * marking another user's notification as read.
 * @param userId The ID of the user.
 * @param notificationId The ID of the notification to mark as read.
 * @returns The updated notification object.
 */
export async function markAsRead(userId: number, notificationId: number): Promise<Notification | null> {
  // First, verify that the notification belongs to the authenticated user.
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.userId !== userId) {
    // If the notification doesn't exist or doesn't belong to the user,
    // we prevent the update to maintain data integrity and security.
    return null;
  }

  // If the user owns the notification, proceed with the update.
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

/**
 * Creates a new notification for a user.
 * This function can be called by other services (e.g., the portfolio service
 * after a trade is processed) to generate a notification.
 * @param userId The ID of the user to notify.
 * @param message The message content of the notification.
 * @returns The newly created notification object.
 */
export async function createNotification(userId: number, message: string): Promise<Notification> {
  return prisma.notification.create({
    data: {
      userId,
      message,
    },
  });
}
