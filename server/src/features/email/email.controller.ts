import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { sendEmail } from './email.service.js';
import { getEmailTemplate } from './email.templates.js';
import { createEmailToken, consumeEmailToken } from './email.tokens.js';
import { TokenPurpose } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcrypt';

dotenv.config();

/**
 * Send verification email to a user
 */
export async function sendVerificationEmail(req: Request, ) {
  const { userId, email } = req.body;

  const token = await createEmailToken(userId, TokenPurpose.EMAIL_VERIFY);

  const url = `${process.env.FRONTEND_URL}/verify?token=${token}`;
  const { subject, html } = getEmailTemplate(TokenPurpose.EMAIL_VERIFY, url);

  await sendEmail(email, subject, html);
}

/**
 * Verify user email using token
 */
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


export async function requestPasswordReset(req: Request, res: Response) {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).send('An account with that email does not exist');

  const token = await createEmailToken(user.id, TokenPurpose.PASSWORD_RESET);
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const { subject, html } = getEmailTemplate(TokenPurpose.PASSWORD_RESET, url);

  await sendEmail(email, subject, html);
  res.send({ sent: true });
}


export async function resetPassword(req: Request, res: Response) {
  const { token, newPassword } = req.body;

  const userId = await consumeEmailToken(token, TokenPurpose.PASSWORD_RESET);
  if (!userId) return res.status(400).send('Invalid or expired token');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }, // Consider hashing in real implementation
  });

  res.send({ success: true });
}
