'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function AuthRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // If user is signed in and on the login page, redirect to dashboard
    if (user && pathname === '/') {
      router.push('/dashboard');
    }

    // If user is not signed in and trying to access dashboard, redirect to login
    if (!user && pathname?.startsWith('/dashboard')) {
      router.push('/');
    }
  }, [user, loading, pathname, router]);

  return null;
}
