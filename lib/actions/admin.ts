"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function getAdminStats() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  const [totalOrders, totalProducts, totalUsers, revenueData] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'CANCELLED' } },
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return {
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue: revenueData._sum.total || 0,
    recentOrders,
  };
}
