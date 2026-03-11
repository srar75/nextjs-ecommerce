"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { productSchema } from '@/lib/validations';

export async function getProducts(params?: {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}) {
  const {
    categorySlug,
    search,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    featured,
    page = 1,
    limit = 12,
  } = params || {};

  const where: Record<string, unknown> = { published: true };

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) (where.price as Record<string, number>).gte = minPrice;
    if (maxPrice !== undefined) (where.price as Record<string, number>).lte = maxPrice;
  }
  if (featured !== undefined) {
    where.featured = featured;
  }

  const orderBy: Record<string, string> = {};
  switch (sortBy) {
    case 'price-asc':
      orderBy.price = 'asc';
      break;
    case 'price-desc':
      orderBy.price = 'desc';
      break;
    case 'newest':
      orderBy.createdAt = 'desc';
      break;
    default:
      orderBy.createdAt = 'desc';
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        reviews: { select: { rating: true } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, pages: Math.ceil(total / limit) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId }, published: true },
    include: { reviews: { select: { rating: true } } },
    take: 4,
  });
}

export async function createProduct(data: unknown) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  const parsed = productSchema.parse(data);
  const slug = parsed.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-');

  const product = await prisma.product.create({
    data: { ...parsed, slug },
  });

  revalidatePath('/products');
  revalidatePath('/admin/products');
  return product;
}

export async function updateProduct(id: string, data: unknown) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  const parsed = productSchema.parse(data);
  const product = await prisma.product.update({
    where: { id },
    data: parsed,
  });

  revalidatePath('/products');
  revalidatePath('/admin/products');
  revalidatePath(`/products/${product.slug}`);
  return product;
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  await prisma.product.delete({ where: { id } });
  revalidatePath('/products');
  revalidatePath('/admin/products');
}
