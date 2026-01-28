import crypto from 'crypto';
import { prisma } from '../../lib/prisma.js';
import { TokenPurpose } from '@prisma/client';

/**
 * Create a token for the user and return the raw token
 */
export async function createEmailToken(userId: string, purpose: TokenPurpose) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  await prisma.token.create({
    data: {
      userId,
      purpose,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h expiry
    },
  });

  return rawToken;
}

/**
 * Consume a token: returns the userId if valid and deletes the token
 */
export async function consumeEmailToken(rawToken: string, purpose: TokenPurpose) {
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  const record = await prisma.token.findFirst({
    where: {
      token: hashedToken,
      purpose,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) return null;

  await prisma.token.delete({ where: { id: record.id } });
  return record.userId;
}
