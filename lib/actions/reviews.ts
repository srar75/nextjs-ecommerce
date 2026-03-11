"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { reviewSchema } from '@/lib/validations';

export async function createReview(productId: string, data: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  const parsed = reviewSchema.parse(data);

  const review = await prisma.review.upsert({
    where: {
      userId_productId: { userId: session.user.id, productId },
    },
    update: parsed,
    create: { ...parsed, userId: session.user.id, productId },
  });

  revalidatePath(`/products`);
  return review;
}
