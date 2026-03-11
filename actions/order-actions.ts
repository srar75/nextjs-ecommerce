'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createOrder(data: {
  addressId: string;
  items: { productId: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      addressId: data.addressId,
      subtotal: data.subtotal,
      shipping: data.shipping,
      total: data.total,
      items: {
        create: data.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    },
    include: { items: true },
  });

  // Decrement stock
  for (const item of data.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  revalidatePath('/profile');
  return order;
}

export async function getUserOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } }, address: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllOrders() {
  const session = await auth();
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error('Unauthorized');
  return prisma.order.findMany({
    include: { items: { include: { product: true } }, address: true, user: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error('Unauthorized');
  return prisma.order.update({
    where: { id: orderId },
    data: { status: status as any },
  });
}
