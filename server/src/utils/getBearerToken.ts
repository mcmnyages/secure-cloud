import type { Request } from 'express';

export const getBearerToken = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (!header) return null;

  const [type, token] = header.split(' ');
  return type === 'Bearer' && token ? token : null;
};
