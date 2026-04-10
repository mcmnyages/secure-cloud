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
};