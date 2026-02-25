import { useMutation } from '@tanstack/react-query';
import { emailService } from '@/api/services/emailService';
import { getErrorMessage } from '@/utils/errors/getErrorMessage';
import { toast } from 'sonner';

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      emailService.resetPassword(token, newPassword),

    onSuccess: () => {
      toast.success('✅ Password reset successful. You can now log in.');
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
