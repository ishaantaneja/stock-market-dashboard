import { prisma } from "../db/prismaClient";

// This service handles all notification-related business logic.
export async function getNotificationsForUser(userId: number) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function markNotificationsAsRead(userId: number, notificationIds: number[]) {
  return prisma.notification.updateMany({
    where: {
      userId,
      id: { in: notificationIds },
    },
    data: {
      read: true,
    },
  });
}

// Function to create a notification, to be called from other services
export async function createNotification(userId: number, message: string) {
  return prisma.notification.create({
    data: { userId, message },
  });
}
