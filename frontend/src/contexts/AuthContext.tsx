'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get the ID token and create a session cookie
        // try {
        //   const idToken = await user.getIdToken();
        //   await fetch('/api/auth/session', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ idToken }),
        //   });
        // } catch (error) {
        //   console.error('Error creating session:', error);
        // }
        console.log('User signed in:', user.uid);
      } else {
        // Clear the session cookie on logout
        // try {
        //   await fetch('/api/auth/logout', { method: 'POST' });
        // } catch (error) {
        //   console.error('Error clearing session:', error);
        // }
        console.log('User signed out');
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle redirects based on auth state
  useEffect(() => {
    if (loading) return;
    console.log("pathname", pathname);
    console.log("user", user);
    console.log("loading", loading);

    // If user is signed in and on the login page, redirect to dashboard
    if (user && pathname === '/') {
      console.log("redirecting to dashboard");
      router.push('/dashboard');
    }

    // If user is not signed in and trying to access dashboard, redirect to login
    if (!user && pathname?.startsWith('/dashboard')) {
      router.push('/');
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
