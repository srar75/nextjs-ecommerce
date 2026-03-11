'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getUserAddresses() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: 'desc' },
  });
}

export async function createAddress(data: any) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: { ...data, userId: session.user.id },
  });
  revalidatePath('/profile');
  return address;
}

export async function deleteAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');
  await prisma.address.delete({ where: { id, userId: session.user.id } });
  revalidatePath('/profile');
}
