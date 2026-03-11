import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and electronics',
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
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home-garden' },
      update: {},
      create: {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Everything for your home',
        image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sports' },
      update: {},
      create: {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports and fitness equipment',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'books' },
      update: {},
      create: {
        name: 'Books',
        slug: 'books',
        description: 'Books and literature',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      },
    }),
  ]);

  console.log('Categories created:', categories.length);

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin.email);

  // Create sample products
  const products = [
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'The most advanced iPhone ever. Titanium design, A17 Pro chip, and a 48MP Main camera system.',
      price: 999.99,
      comparePrice: 1099.99,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
        'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600',
      ],
      stock: 50,
      featured: true,
      categorySlug: 'electronics',
    },
    {
      name: 'MacBook Pro 16"',
      slug: 'macbook-pro-16',
      description: 'Supercharged by M3 Pro or M3 Max. The most powerful MacBook Pro ever.',
      price: 2499.99,
      comparePrice: 2799.99,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
        'https://images.unsplash.com/photo-1611186871525-10a05e17b53b?w=600',
      ],
      stock: 25,
      featured: true,
      categorySlug: 'electronics',
    },
    {
      name: 'Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5',
      description: 'Industry-leading noise canceling headphones with 30-hour battery life.',
      price: 349.99,
      comparePrice: 399.99,
      images: [
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600',
      ],
      stock: 100,
      featured: true,
      categorySlug: 'electronics',
    },
    {
      name: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      description: 'The Nike Air Max 270 delivers an exceptional underfoot experience with a large Air unit.',
      price: 150.00,
      comparePrice: 180.00,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      ],
      stock: 200,
      featured: false,
      categorySlug: 'sports',
    },
    {
      name: 'Classic White T-Shirt',
      slug: 'classic-white-tshirt',
      description: 'Premium cotton t-shirt, perfect for everyday wear. Available in multiple sizes.',
      price: 29.99,
      comparePrice: 39.99,
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
      ],
      stock: 500,
      featured: false,
      categorySlug: 'clothing',
    },
    {
      name: 'Minimalist Desk Lamp',
      slug: 'minimalist-desk-lamp',
      description: 'Modern LED desk lamp with adjustable brightness and color temperature.',
      price: 79.99,
      comparePrice: 99.99,
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
      ],
      stock: 75,
      featured: true,
      categorySlug: 'home-garden',
    },
    {
      name: 'JavaScript: The Good Parts',
      slug: 'javascript-good-parts',
      description: 'Most JavaScript books focus on the bad parts. This book focuses on the good parts.',
      price: 24.99,
      comparePrice: 34.99,
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
      ],
      stock: 150,
      featured: false,
      categorySlug: 'books',
    },
    {
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description: 'Non-slip premium yoga mat with alignment lines. Perfect for yoga, pilates and fitness.',
      price: 59.99,
      comparePrice: 79.99,
      images: [
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600',
      ],
      stock: 120,
      featured: false,
      categorySlug: 'sports',
    },
  ];

  for (const productData of products) {
    const { categorySlug, ...data } = productData;
    const category = categories.find((c) => c.slug === categorySlug);
    if (!category) continue;

    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        categoryId: category.id,
      },
    });
  }

  console.log('Products created:', products.length);
  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
