"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { checkoutSchema } from '@/lib/validations';
import { clearCart } from './cart';

export async function createOrder(data: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  const parsed = checkoutSchema.parse(data);

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (!cartItems.length) throw new Error('Cart is empty');

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  // Create address
  const address = await prisma.address.create({
    data: { ...parsed.address, userId: session.user.id },
  });

  // Create order
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      addressId: address.id,
      subtotal,
      shipping,
      tax,
      total,
      notes: parsed.notes,
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
    include: { items: true },
  });

  await clearCart();
  revalidatePath('/orders');
  return order;
}

export async function getUserOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { include: { product: true } },
      address: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getOrderById(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  return prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: {
      items: { include: { product: true } },
      address: true,
    },
  });
}

export async function getAllOrders() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  return prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: true } },
      address: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: status as never },
  });

  revalidatePath('/admin/orders');
  return order;
}
