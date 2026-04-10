import { useQuery } from '@tanstack/react-query';
import { notificationService, type GetNotificationsParams } from '@/api/services/notificationService';

export const useNotifications = (params?: GetNotificationsParams) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationService.getNotifications(params),
    placeholderData: (previousData) => previousData, // smooth pagination UX
  });
};