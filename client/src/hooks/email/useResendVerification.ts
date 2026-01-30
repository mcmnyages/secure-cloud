import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { emailService } from "../../api/services/emailService";
import { getAxiosErrorMessage } from "../../utils/getAxiosErrorMessage";


export const useResendVerification = () =>
  useMutation({
    mutationFn: (data: { userId: string; email: string }) =>
      emailService.sendVerification(data),

    onSuccess: (response) => {
      toast.success(response.message);
    },

    onError: () => {
      toast.error(getAxiosErrorMessage(Error));
    },
  });

  