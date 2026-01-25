import type { Request, Response, NextFunction } from 'express';
import { getBearerToken } from '../utils/getBearerToken.js';
import { verifyJwt } from '../utils/verifyJwt.js';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = getBearerToken(req);

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const { userId } = verifyJwt(token);
    req.userId = userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
