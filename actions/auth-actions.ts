'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations';
import { signIn, signOut } from '@/lib/auth';

export async function register(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }
  const { name, email, password } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: 'Email already in use' };
  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, password: hashed } });
  return { success: 'Account created! Please log in.' };
}

export async function login(data: { email: string; password: string }) {
  try {
    await signIn('credentials', { ...data, redirect: false });
    return { success: true };
  } catch {
    return { error: 'Invalid credentials' };
  }
}

export async function logout() {
  await signOut({ redirectTo: '/' });
}
