import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { emailService } from "../../api/services/emailService";

export const useResendVerification = () =>
  useMutation({
    mutationFn: (data: { userId: string; email: string }) =>
      emailService.sendVerification(data),

    onSuccess: () => {
      toast.success("Verification email sent!");
    },

    onError: () => {
      toast.error("Unable to send verification email. Please try later.");
    },
  });

  