// api/services/emailService.ts
import api from "../axios";
import type { VerifyEmailResponse } from "../../types/authTypes";

export const emailService = {
  sendVerification: async (data: { userId: string; email: string }) => {
    console.log("Sending verification email to:", data);
    await api.post("/email/send-verification", { data });
  },
  verifyEmail: async (token: string) =>
    api.get<VerifyEmailResponse>(`/email/verify?token=${token}`).then(res => res.data),
};
