import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../../libs/db';
import { HttpError } from '../../utils/httpError';

export async function listCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    select: { id: true, name: true, createdAt: true },
    orderBy: { name: 'asc' },
  });
}

export async function createCategory(userId: string, name: string) {
  try {
    return await prisma.category.create({
      data: { userId, name },
      select: { id: true, name: true, createdAt: true },
    });
  } catch (e: unknown) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
      throw new HttpError(409, 'Category name already exists');
    } else {
      throw e;
    }
  }
}

export async function renameCategory(userId: string, id: string, name: string) {
  const owned = await prisma.category.findUnique({ where: { id, userId } });
  if (!owned) throw new HttpError(404, 'Category not found');
  try {
    return await prisma.category.update({
      where: { id },
      data: { name },
      select: { id: true, name: true, createdAt: true },
    });
  } catch (e: unknown) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
      throw new HttpError(409, 'Category name already exists');
    } else {
      throw e;
    }
  }
}

export async function deleteCategory(userId: string, id: string) {
  const usage = await prisma.expense.count({
    where: { userId, categoryId: id },
  });

  if (usage > 0) {
    throw new HttpError(400, 'in use');
  }

  await prisma.category.delete({ where: { id } });
}

export async function getCategoryCount(userId: string, id: string) {
  const count = await prisma.expense.count({
    where: { categoryId: id },
  });
  return count;
}
