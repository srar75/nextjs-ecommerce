"use server";

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations';
import { signIn } from '@/auth';

export async function registerUser(data: unknown) {
  const parsed = registerSchema.parse(data);

  const existing = await prisma.user.findUnique({
    where: { email: parsed.email },
  });

  if (existing) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(parsed.password, 12);

  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      password: hashedPassword,
    },
  });

  await signIn('credentials', {
    email: parsed.email,
    password: parsed.password,
    redirectTo: '/',
  });

  return user;
}
