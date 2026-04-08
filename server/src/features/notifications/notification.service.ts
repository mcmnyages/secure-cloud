import {prisma} from "../../lib/prisma.js";
import type { CreateNotificationDTO, NotificationQuery } from "./notification.types.js";

export class NotificationService {
  async createNotification(data: CreateNotificationDTO) {
    return prisma.notification.create({ data });
  }

  async getUserNotifications(userId: string, query: NotificationQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return prisma.notification.findMany({
      where: {
        userId,
        ...(query.onlyUnread && { isRead: false }),
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    return prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });
  }

  async deleteAllNotifications(userId: string) {
    return prisma.notification.deleteMany({
      where: {
        userId,
      },
    });
  }
}