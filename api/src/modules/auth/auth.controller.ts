import type { RequestHandler } from 'express';
import { login, register } from './auth.service';
import { signAccessToken } from '../../libs/jwt';
import { env } from '../../config/env';

export const postRegister: RequestHandler = async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await register(email, password);
  res.status(201).json({ id: user.id, email: user.email });
};

export const postLogin: RequestHandler = async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await login(email, password);
  const token = signAccessToken(user.id);
  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // true in production behind HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ id: user.id, email: user.email });
};

export const postLogout: RequestHandler = async (_req, res) => {
  res.clearCookie(env.COOKIE_NAME);
  res.status(204).send();
};
