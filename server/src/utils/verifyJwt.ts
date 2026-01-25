import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
}

export const verifyJwt = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
};
