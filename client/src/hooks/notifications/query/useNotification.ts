import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { notificationService, type GetNotificationsParams } from '@/api/services/notificationService';

// We use 'any' for the data type here for simplicity, 
// but you can replace it with your specific Notification type/interface
export const useNotifications = (
  params?: GetNotificationsParams,
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationService.getNotifications(params),
    placeholderData: (previousData) => previousData,
    ...options, // This spreads enabled, staleTime, etc.
  });
};