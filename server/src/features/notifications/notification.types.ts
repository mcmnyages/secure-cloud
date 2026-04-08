import { NotificationType } from "@prisma/client";

export type CreateNotificationDTO = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
};

export type NotificationQuery = {
  page?: number;
  limit?: number;
  onlyUnread?: boolean;
};