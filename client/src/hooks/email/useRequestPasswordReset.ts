import { useMutation } from "@tanstack/react-query";
import { emailService } from "../../api/services/emailService";
import { getErrorMessage } from "@/utils/errors/getErrorMessage";
import { toast } from "sonner";

export function useRequestPasswordReset() {
    return useMutation({
        mutationFn: (email: string) => emailService.requestPasswordReset(email),
        onSuccess: (response) => {
            toast.success(response.message);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    }); 
}