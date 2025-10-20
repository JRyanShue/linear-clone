'use server';

import { signIn } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';

export async function login(email: string, password: string) {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!result) {
      return { error: 'Invalid credentials' };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' };
        default:
          return { error: 'Something went wrong' };
      }
    }
    throw error;
  }
}

export async function register(
  email: string,
  password: string,
  name: string
) {
  try {
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return { error: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
    });

    // Sign in the user
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    return { error: 'Something went wrong' };
  }
}


