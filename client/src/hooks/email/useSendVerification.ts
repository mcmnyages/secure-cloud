import { useMutation } from "@tanstack/react-query";
import { emailService } from "@/api/services/emailService";
import { getErrorMessage } from "@/utils/errors/getErrorMessage";
import { toast } from "sonner";

export const useResendVerification = () => {
  return useMutation({
     mutationFn: (data: { userId: string; email: string }) =>
      emailService.sendVerification(data),

    onSuccess: () => {
      toast.success("Verification email resent");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

