'use server';

import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/lib/utils';
import type { FilterParams } from '@/types';
import { auth } from '@/lib/auth';

export async function getProducts(params: FilterParams = {}) {
  const { category, minPrice, maxPrice, rating, sort, search, page = 1, limit = 12 } = params;
  const where: any = { published: true };
  if (category) where.category = { slug: category };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }
  if (search) where.name = { contains: search, mode: 'insensitive' };

  const orderBy: any =
    sort === 'price_asc' ? { price: 'asc' }
    : sort === 'price_desc' ? { price: 'desc' }
    : sort === 'newest' ? { createdAt: 'desc' }
    : { createdAt: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, reviews: true },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, pages: Math.ceil(total / limit), page };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: { include: { user: { select: { id: true, name: true, image: true } } }, orderBy: { createdAt: 'desc' } },
    },
  });
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, published: true },
    include: { category: true, reviews: true },
    take: 8,
  });
}

export async function getRelatedProducts(productId: string, categoryId: string) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: productId }, published: true },
    include: { category: true, reviews: true },
    take: 4,
  });
}

export async function createProduct(data: any) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error('Unauthorized');
  return prisma.product.create({
    data: { ...data, slug: generateSlug(data.name) },
  });
}

export async function updateProduct(id: string, data: any) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error('Unauthorized');
  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error('Unauthorized');
  return prisma.product.delete({ where: { id } });
}
