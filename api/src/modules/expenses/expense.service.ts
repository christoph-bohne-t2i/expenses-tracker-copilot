import { prisma } from '../../libs/db';
import { endOfDay, startOfDay } from '../../utils/date-helper';
import { HttpError } from '../../utils/httpError';

export async function listExpenses(
  userId: string,
  params?: { from?: Date; to?: Date; categoryId?: string }
) {
  const where: any = { userId };
  if (params?.from || params?.to) {
    where.date = {};
    if (params.from) where.date.gte = startOfDay(params.from);
    if (params.to) where.date.lte = endOfDay(params.to);
  }
  if (params?.categoryId) {
    where.categoryId = params.categoryId;
  }
  return prisma.expense.findMany({
    where,
    orderBy: { date: 'desc' },
    include: { category: true },
  });
}

export async function createExpense(
  userId: string,
  data: {
    description: string;
    amount: number;
    date: Date;
    categoryId?: string | null;
  }
) {
  if (data.categoryId) {
    const owned = await prisma.category.findUnique({
      where: { id: data.categoryId, userId },
    });
    if (!owned) throw new HttpError(400, 'Invalid categoryId');
  }
  return prisma.expense.create({
    data: { ...data, userId },
    include: { category: true },
  });
}

export async function deleteExpense(userId: string, id: string) {
  const exists = await prisma.expense.findUnique({ where: { id, userId } });
  if (!exists) return false;
  await prisma.expense.delete({ where: { id } });
  return true;
}

export async function getExpense(id: string) {
  return prisma.expense.findUnique({ where: { id } });
}
