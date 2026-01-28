import { TokenPurpose } from '@prisma/client';

export function getEmailTemplate(purpose: TokenPurpose, url: string) {
  switch (purpose) {
    case TokenPurpose.EMAIL_VERIFY:
      return {
        subject: 'Verify Your Email',
        html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
      };
    case TokenPurpose.PASSWORD_RESET:
      return {
        subject: 'Reset Your Password',
        html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
      };
  }
}
