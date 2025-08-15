import { prisma } from '../../libs/db';
import { hashPassword, verifyPassword } from '../../libs/password';
import { HttpError } from '../../utils/httpError';

export async function register(email: string, password: string) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new HttpError(409, 'Email already registered');
  const passwordHash = await hashPassword(password);
  return prisma.user.create({ data: { email, passwordHash } });
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new HttpError(401, 'Invalid credentials');
  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) throw new HttpError(401, 'Invalid credentials');
  return user;
}
