import { useMutation } from "@tanstack/react-query";
import { emailService } from "../../api/services/emailService";
import { getAxiosErrorMessage } from "../../utils/getAxiosErrorMessage";
import { toast } from "sonner";

export function useRequestPasswordReset() {
    return useMutation({
        mutationFn: (email: string) => emailService.requestPasswordReset(email),
        onSuccess: (response) => {
            toast.success(response.message);
        },
        onError: () => {
            toast.error(getAxiosErrorMessage(Error));
        },
    }); 
}