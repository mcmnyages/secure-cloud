import type { Request, Response } from 'express';
import { sendEmail } from './email.service.js';
import { getEmailTemplate } from './email.templates.js';
import { createEmailToken, consumeEmailToken } from './email.tokens.js';
import { TokenPurpose } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcrypt';

// Send verification email
export async function sendVerificationEmail({ userId, email }: { userId: string, email: string }) {
  try {
    const token = await createEmailToken(userId, TokenPurpose.EMAIL_VERIFY);
    const path = `/verify?token=${token}`;

    const { subject, html } = getEmailTemplate(TokenPurpose.EMAIL_VERIFY, path);
    await sendEmail(email, subject, html);
  } catch (error) {
    console.error("sendVerificationEmail error:", error);
    throw new Error("Failed to send verification email");
  }
}

// Verify email
export async function verifyEmail(req: Request, res: Response) {
  try {
    const token = String(req.query.token);

    const userId = await consumeEmailToken(token, TokenPurpose.EMAIL_VERIFY);

    if (!userId) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { verified: true },
    });

    return res.json({ verified: true });

  } catch (error) {
    console.error("verifyEmail error:", error);
    return res.status(500).json({
      message: "Email verification failed"
    });
  }
}

// Request password reset
export async function requestPasswordReset(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(200).json({
        message: 'An account with that email does not exist',
        sent: false,
      });
    }

    const token = await createEmailToken(user.id, TokenPurpose.PASSWORD_RESET);
    const path = `/reset-password?token=${token}`;

    const { subject, html } = getEmailTemplate(TokenPurpose.PASSWORD_RESET, path);
    await sendEmail(email, subject, html);

    return res.json({
      message: 'Check your email for password reset instructions',
      sent: true,
    });

  } catch (error) {
    console.error("requestPasswordReset error:", error);
    return res.status(500).json({
      message: "Failed to send password reset email"
    });
  }
}

// Reset password
export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;

    const userId = await consumeEmailToken(token, TokenPurpose.PASSWORD_RESET);

    if (!userId) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.json({ success: true });

  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({
      message: "Password reset failed"
    });
  }
}