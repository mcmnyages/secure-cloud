import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationService } from "@/api/services/notificationService";
import { getErrorMessage } from "@/utils/errors/getErrorMessage";



export const useNotificationsAction = () => {
  const queryClient = useQueryClient();

    const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };

    const markAsRead = useMutation({

        mutationFn: (id: string) => notificationService.markAsRead(id),
        onSuccess: () => {
            invalidate();
            toast.success('Notification marked as read');
        },
        onError: (err) => toast.error(getErrorMessage(err)),
    });

    const markAllAsRead = useMutation({

        mutationFn: () => notificationService.markAllAsRead(),
        onSuccess: () => {
            invalidate();
            toast.success('All notifications marked as read');
        },

        onError: (err) => toast.error(getErrorMessage(err)),
    });

    const deleteNotification = useMutation({

        mutationFn: (id: string) => notificationService.deleteNotification(id),
        onSuccess: () => {
            invalidate();
            toast.success('Notification deleted');
        },
        onError: (err) => toast.error(getErrorMessage(err)),
    });

    const deleteAllNotifications = useMutation({

        mutationFn: () => notificationService.deleteAllNotifications(),
        onSuccess: () => {
            invalidate();
            toast.success('All notifications deleted');
        },
        onError: (err) => toast.error(getErrorMessage(err)),
    });

    return {
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications
    };

  }