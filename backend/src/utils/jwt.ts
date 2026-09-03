import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  userId: string;
}

export const signAccess = (payload: TokenPayload): string => {
  return jwt.sign(payload as any, env.JWT_ACCESS_SECRET as any, { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any });
};

export const signRefresh = (payload: TokenPayload): string => {
  return jwt.sign(payload as any, env.JWT_REFRESH_SECRET as any, { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any });
};

export const verifyAccess = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
};

export const verifyRefresh = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
};
