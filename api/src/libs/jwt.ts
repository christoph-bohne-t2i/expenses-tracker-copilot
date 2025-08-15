import jwt from 'jsonwebtoken';
import { env } from '../config/env';

type Payload = { sub: string };
export function signAccessToken(
  userId: string,
  expiresIn: number = 7 * 24 * 60 * 60 * 1000
) {
  return jwt.sign({ sub: userId } satisfies Payload, env.JWT_SECRET, {
    expiresIn,
  });
}
export function verifyAccessToken<T extends Payload = Payload>(
  token: string
): T | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as T;
  } catch {
    return null;
  }
}
