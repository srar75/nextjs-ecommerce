'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createReview(data: {
  productId: string;
  rating: number;
  comment?: string;
  productSlug: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Not authenticated' };

  try {
    await prisma.review.create({
      data: {
        userId: session.user.id,
        productId: data.productId,
        rating: data.rating,
        comment: data.comment,
      },
    });
    revalidatePath(`/products/${data.productSlug}`);
    return { success: true };
  } catch {
    return { error: 'You have already reviewed this product' };
  }
}
