import type { Request, Response } from 'express';
import { sendEmail } from './email.service.js';
import { getEmailTemplate } from './email.templates.js';
import { createEmailToken, consumeEmailToken } from './email.tokens.js';
import { TokenPurpose } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcrypt';

// Send verification email
export async function sendVerificationEmail(req: Request, res: Response) {
  const { userId, email } = req.body;

  const token = await createEmailToken(userId, TokenPurpose.EMAIL_VERIFY);
  const path = `/verify?token=${token}`; // Only the path

  const { subject, html } = getEmailTemplate(TokenPurpose.EMAIL_VERIFY, path);
  await sendEmail(email, subject, html);

  res.json({ message: "Verification email sent" });
}

// Verify email
export async function verifyEmail(req: Request, res: Response) {
  const token = String(req.query.token);
  const userId = await consumeEmailToken(token, TokenPurpose.EMAIL_VERIFY);

  if (!userId) return res.status(400).send('Invalid or expired token');

  await prisma.user.update({
    where: { id: userId },
    data: { verified: true },
  });

  res.send({ verified: true });
}

// Request password reset
export async function requestPasswordReset(req: Request, res: Response) {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(200).json({
      message: 'An account with that email does not exist',
      sent: false,
    });
  }

  const token = await createEmailToken(user.id, TokenPurpose.PASSWORD_RESET);
  const path = `/reset-password?token=${token}`; // Only the path

  const { subject, html } = getEmailTemplate(TokenPurpose.PASSWORD_RESET, path);
  await sendEmail(email, subject, html);

  res.json({
    message: 'Check your email for password reset instructions',
    sent: true,
  });
}

// Reset password
export async function resetPassword(req: Request, res: Response) {
  const { token, newPassword } = req.body;
  const userId = await consumeEmailToken(token, TokenPurpose.PASSWORD_RESET);

  if (!userId) return res.status(400).send('Invalid or expired token');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  res.send({ success: true });
}