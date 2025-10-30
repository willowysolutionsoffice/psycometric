"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/components/auth/login-form';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    try {
      const hasUser = typeof window !== 'undefined' && localStorage.getItem('authUser');
      if (hasUser) router.replace('/');
    } catch {}
  }, [router]);

  return <LoginPage />;
}