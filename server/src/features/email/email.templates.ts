import { TokenPurpose } from '@prisma/client';
import { env } from '../../config/env.js';

export function getEmailTemplate(purpose: TokenPurpose, path: string) {
  // Construct absolute frontend URL safely
 const link = path.startsWith("http")
  ? path
  : new URL(path, env.frontendUrl).toString();
  const logoUrl = new URL("/favicon.ico", env.frontendUrl).toString();
 

  const baseTemplate = (title: string, message: string, buttonText: string, color: string) => `
    <div style="background:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:10px;
                  padding:40px;text-align:center;
                  box-shadow:0 5px 15px rgba(0,0,0,0.08);">

        <!-- Logo served from backend -->
        <img src="${logoUrl}" alt="Secure Cloud"
             width="120"
             style="margin-bottom:25px;" />
             <p>${logoUrl}</p>

        <h2 style="color:#1f2937;margin-bottom:10px;">${title}</h2>

        <p style="color:#4b5563;font-size:16px;line-height:1.6;">${message}</p>

        <a href="${link}"
          style="
          display:inline-block;
          margin-top:30px;
          padding:14px 28px;
          background:${color};
          color:white;
          text-decoration:none;
          border-radius:8px;
          font-weight:bold;
          font-size:15px;">
          ${buttonText}
        </a>

        <p style="margin-top:30px;color:#6b7280;font-size:13px;">
          If the button above doesn't work, copy and paste this link into your browser:
        </p>

        <p style="word-break:break-all;font-size:13px;">
          <a href="${link}" style="color:${color};">${link}</a>
        </p>

        <hr style="margin:35px 0;border:none;border-top:1px solid #eee;" />

        <p style="font-size:12px;color:#9ca3af;">
          This email was sent by <strong>Secure Cloud</strong>.
          If you didn't request this, you can safely ignore this message.
        </p>

        <p style="font-size:11px;color:#9ca3af;margin-top:8px;">
          © ${new Date().getFullYear()} Secure Cloud. All rights reserved.
        </p>

      </div>
    </div>
  `;

  switch (purpose) {
    case TokenPurpose.EMAIL_VERIFY:
      return {
        subject: "Verify Your Email",
        html: baseTemplate(
          "Welcome to Secure Cloud ☁️",
          "Thank you for creating an account. Please confirm your email address to activate your account.",
          "Verify Email",
          "#22c55e"
        ),
      };

    case TokenPurpose.PASSWORD_RESET:
      return {
        subject: "Reset Your Password",
        html: baseTemplate(
          "Password Reset Request 🔐",
          "We received a request to reset your password. Click the button below to set a new password.",
          "Reset Password",
          "#ef4444"
        ),
      };

    default:
      throw new Error(`Unknown TokenPurpose: ${purpose}`);
  }
}