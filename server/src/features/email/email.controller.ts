import type { Request, Response } from 'express';
import { sendEmail } from './email.service.js';
import { getEmailTemplate } from './email.templates.js';
import { createEmailToken, consumeEmailToken } from './email.tokens.js';
import { TokenPurpose } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';

/**
 * Send verification email to a user
 */
export async function sendVerificationEmail(req: Request, res: Response) {
  const { userId, email } = req.body;

  const token = await createEmailToken(userId, TokenPurpose.EMAIL_VERIFY);

  const url = `${process.env.FRONTEND_URL}/verify?token=${token}`;
  const { subject, html } = getEmailTemplate(TokenPurpose.EMAIL_VERIFY, url);

  await sendEmail(email, subject, html);

  res.send({ sent: true });
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
