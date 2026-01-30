import { useMutation } from "@tanstack/react-query";
import { emailService } from "../../api/services/emailService";
import { toast } from "sonner";

export function useRequestPasswordReset() {
    return useMutation({
        mutationFn: (email: string) => emailService.requestPasswordReset(email),
        onSuccess: () => {
            toast.success("📩 If an account exists, a reset link has been sent.");
        },
        onError: () => {
            toast.error("❌ Failed to send reset link. Please try again.");
        },
    }); 
}