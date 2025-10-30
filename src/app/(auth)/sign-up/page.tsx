"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignUpPage from '@/components/auth/sign-up';

export default function SignUp() {
  const router = useRouter();

  useEffect(() => {
    try {
      const hasUser = typeof window !== 'undefined' && localStorage.getItem('authUser');
      if (hasUser) router.replace('/');
    } catch {}
  }, [router]);

  return <SignUpPage />;
}