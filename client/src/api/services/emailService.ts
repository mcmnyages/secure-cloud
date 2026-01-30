// api/services/emailService.ts
import api from "../axios";
import type { VerifyEmailResponse } from "../../types/authTypes";

export const emailService = {
  sendVerification: async (data: { userId: string; email: string }) => {
    await api.post("/email/send-verification", { data });
  },
  verifyEmail: async (token: string) =>{
    api.get<VerifyEmailResponse>(`/email/verify?token=${token}`).then(res => res.data);
  },

  requestPasswordReset: async (email: string) => {
    await api.post("/email/request-password-reset", { email });
  },
resetPassword: async (token: string, newPassword: string) => {
  await api.post('/email/reset-password', {
    token,
    newPassword,
  });
},
};
