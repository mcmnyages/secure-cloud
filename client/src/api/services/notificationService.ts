import api from '../axios';
import type {  NotificationsResponse } from '@/types/notificationTypes';

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  onlyUnread?: boolean;
}

export const notificationService = {
  getNotifications: async (
    params?: GetNotificationsParams
  ) => {
    const res = await api.get<NotificationsResponse>('/notifications', {
      params,
    });

    return res.data.data; // now returns paginated object
  },
  
  getUnreadCount: async () => {
    const res = await api.get<{ unreadCount: number }>('/notifications/unread-count');
    return res.data.unreadCount;
  },
  markAsRead: async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
  },
  markAllAsRead: async () => {
    await api.patch('/notifications/read-all');
  },
  deleteNotification: async (id: string) => {
    await api.delete(`/notifications/${id}`);
  },
  deleteAllNotifications: async () => {
    await api.delete('/notifications/delete-all');
  }

};