"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { userInfo, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!userInfo && pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [userInfo, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a2e]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If not logged in and not on login page, don't show children while redirecting
  if (!userInfo && pathname !== '/login') {
    return null;
  }

  return children;
}
