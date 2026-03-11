"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getCart() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addToCart(productId: string, quantity = 1) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { userId: session.user.id, productId, quantity },
    });
  }

  revalidatePath('/cart');
}

export async function updateCartItem(itemId: string, quantity: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  revalidatePath('/cart');
}

export async function removeFromCart(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  await prisma.cartItem.delete({ where: { id: itemId } });
  revalidatePath('/cart');
}

export async function clearCart() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
  revalidatePath('/cart');
}
