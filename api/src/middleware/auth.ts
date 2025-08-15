import type { RequestHandler } from 'express';
import { verifyAccessToken } from '../libs/jwt';
import { env } from '../config/env';
import { HttpError } from '../utils/httpError';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = req.cookies?.[env.COOKIE_NAME];
  const payload = token ? verifyAccessToken<{ sub: string }>(token) : null;
  if (!payload) throw new HttpError(401, 'Unauthorized');
  req.userId = payload.sub;
  next();
};
