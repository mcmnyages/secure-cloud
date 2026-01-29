import { useQuery } from "@tanstack/react-query";
import { emailService } from "../../api/services/emailService";
import type { VerifyEmailResponse } from "../../types/authTypes";

export const useVerifyEmail = (token: string) =>
  useQuery<VerifyEmailResponse>({
    queryKey: ["verifyEmail", token],
    queryFn: () => emailService.verifyEmail(token),
    enabled: !!token, // only run if token exists
  });
