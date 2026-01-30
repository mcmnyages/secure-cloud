// api/services/emailService.ts
import api from "../axios";
import type { 
  VerifyEmailResponse,
  PasswordResetResponse
 } from "../../types/emailTypes";

export const emailService = {
  sendVerification: async (data: { userId: string; email: string }) => {
   const res=await api.post("/email/send-verification", { data });
   return res.data
  },
  verifyEmail: async (token: string) =>{
    const res = api.get<VerifyEmailResponse>(`/email/verify?token=${token}`).then(res => res.data);
    return res;
  },

  requestPasswordReset: async (email: string) => {
    const data =await api.post<PasswordResetResponse>("/email/request-password-reset", { email });
    return data.data;
  },
resetPassword: async (token: string, newPassword: string) => {
  const data =await api.post('/email/reset-password', {
    token,
    newPassword,
  });
  return data.data;
},
};
