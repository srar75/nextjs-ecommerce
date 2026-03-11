import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@store.com' },
    update: {},
    create: {
      email: 'admin@store.com',
      name: 'Admin',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Gadgets and electronic devices',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'clothing' },
      update: {},
      create: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home-garden' },
      update: {},
      create: {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home decor and garden supplies',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sports' },
      update: {},
      create: {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and apparel',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
      },
    }),
  ]);

  // Products
  const products = [
    {
      name: 'Wireless Headphones Pro',
      slug: 'wireless-headphones-pro',
      description: 'Premium noise-cancelling wireless headphones with 40h battery life.',
      price: 299.99,
      comparePrice: 399.99,
      stock: 50,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
      ],
      featured: true,
      categoryId: categories[0].id,
    },
    {
      name: 'Smart Watch Series X',
      slug: 'smart-watch-series-x',
      description: 'Advanced smartwatch with health monitoring and GPS.',
      price: 449.99,
      comparePrice: 549.99,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
      featured: true,
      categoryId: categories[0].id,
    },
    {
      name: 'Classic Denim Jacket',
      slug: 'classic-denim-jacket',
      description: 'Timeless denim jacket for everyday wear.',
      price: 89.99,
      comparePrice: null,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'],
      featured: false,
      categoryId: categories[1].id,
    },
    {
      name: 'Running Shoes Ultra',
      slug: 'running-shoes-ultra',
      description: 'High-performance running shoes with advanced cushioning.',
      price: 149.99,
      comparePrice: 199.99,
      stock: 75,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
      featured: true,
      categoryId: categories[3].id,
    },
    {
      name: 'Minimalist Desk Lamp',
      slug: 'minimalist-desk-lamp',
      description: 'LED desk lamp with adjustable brightness and color temperature.',
      price: 59.99,
      comparePrice: null,
      stock: 40,
      images: ['https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=600'],
      featured: false,
      categoryId: categories[2].id,
    },
    {
      name: 'Laptop Backpack Pro',
      slug: 'laptop-backpack-pro',
      description: '30L waterproof backpack with USB charging port, fits 17" laptop.',
      price: 79.99,
      comparePrice: 99.99,
      stock: 60,
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
      featured: true,
      categoryId: categories[1].id,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p as any,
    });
  }

  console.log('Seeding complete!');
  console.log('Admin:', admin.email, '/ Password: admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
