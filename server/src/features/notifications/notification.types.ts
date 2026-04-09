export type CreateNotificationDTO = {
  userId: string;
  type: string;
  title: string;
  message: string;
};

export type NotificationQuery = {
  page?: number;
  limit?: number;
  onlyUnread?: boolean;
};