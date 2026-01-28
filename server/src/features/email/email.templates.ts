import { TokenPurpose } from '@prisma/client';

export function getEmailTemplate(purpose: TokenPurpose, url: string) {
  switch (purpose) {
    case TokenPurpose.EMAIL_VERIFY:
      return {
        subject: 'Verify Your Email',
        html: `
        <img src="https://yourdomain.com/logo.png" alt="My App" width="120" style="margin-bottom:20px;">

          <div style="font-family: Arial, sans-serif; text-align:center; padding:20px;">
            <h2 style="color:#333;">Welcome to Secure Cloud!</h2>
            <p>Click the button below to verify your email address:</p>
            <a href="${url}" 
               style="display:inline-block; padding:12px 24px; margin-top:20px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
              Verify Email
            </a>
            <p style="margin-top:20px; font-size:12px; color:#666;">
              If you did not create an account, you can ignore this email.
            </p>
          </div>
        `,
      };

    case TokenPurpose.PASSWORD_RESET:
  return {
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; text-align:center; padding:20px;">
        <img src="https://yourdomain.com/logo.png" alt="My App" width="120" style="margin-bottom:20px;">
        <h2 style="color:#333;">Password Reset Request</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${url}" 
           style="display:inline-block; padding:12px 24px; margin-top:20px; background-color:#FF5722; color:white; text-decoration:none; border-radius:5px;">
          Reset Password
        </a>
        <p style="margin-top:20px; font-size:12px; color:#666;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
        <p>If the button doesn’t work, copy this link into your browser:</p>
        <a href="${url}">${url}</a>
      </div>
    `,
  };
  }
}
