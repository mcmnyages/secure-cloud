// api/services/emailService.ts
import api from "../axios";

export const emailService = {
  sendVerification: async (data: { userId: string; email: string }) => {
    console.log("Sending verification email to:", data);
    await api.post("/email/send-verification", { data });
  },
};
