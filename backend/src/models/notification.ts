/**
 * This file defines the TypeScript interface for a notification.
 * This interface is a crucial component of our data layer, ensuring consistency
 * between the database schema and our application code.
 */

export interface Notification {
  id: number;
  userId: number;
  message: string;
  read: boolean;
  createdAt: Date;
}
