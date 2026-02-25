import { useMutation } from "@tanstack/react-query";
import { authService } from "../../api/services/authService";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/utils/errors/getErrorMessage";
import { toast } from "sonner";

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.register,

    onSuccess: ({ user }) => {
      toast.success("Account created. Check your email for verification.");

      navigate("/verify-email", {
        state: {userId:user.id, email: user.email },
      });
    },

    onError: (error: any) => {
      toast.error(
        getErrorMessage(error)
      );
    },
  });
};
