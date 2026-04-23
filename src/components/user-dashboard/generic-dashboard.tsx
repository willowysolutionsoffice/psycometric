"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface DashboardContentProps {
  title: string;
  subheading: string;
  description: string;
  imageSrc: string;
}

export default function GenericDashboard({ title, subheading, description, imageSrc }: DashboardContentProps) {
  const router = useRouter();
  const [hasAttempted, setHasAttempted] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in (but don't redirect)
    const checkLoginStatus = () => {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
        if (raw) {
          setIsLoggedIn(true);
          const user = JSON.parse(raw) as { id?: string };
          if (user?.id) {
            // Check if user has attempted the test
            fetch(`/api/results?userId=${user.id}`)
              .then(res => res.json())
              .then(data => setHasAttempted(Boolean(data?.exists)))
              .catch(() => { });
          }
        }
      } catch { }
    };

    checkLoginStatus();
  }, []);

  const handleGetStartedClick = () => {
    // Check if user is logged in
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
      if (!raw) {
        // Not logged in, redirect to login
        router.push('/login');
        return;
      }
      // Logged in, redirect based on whether they've attempted the test
      if (!hasAttempted) {
        try { sessionStorage.removeItem('testInProgress'); } catch { } // << clear on fresh test
      }
      router.push(hasAttempted ? '/interest-result' : '/test-questions');
    } catch {
      // Error reading localStorage, redirect to login
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section with Coral/Red Background */}
        <div className="bg-gradient-to-r from-red-400 to-red-500 rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Brain Illustration Image */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-square">
                <Image
                  src={imageSrc}
                  alt={`${title} Brain Diagram`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Right Side - Text Content */}
            <div className="text-white space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold">
                {title}
              </h1>

              <p className="text-lg leading-relaxed opacity-95 text-red-100 font-semibold italic">
                {subheading}
              </p>

              <p className="text-base leading-relaxed opacity-90">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Get Started / View Result Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleGetStartedClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-4 rounded-lg shadow-lg transition-colors duration-200 text-lg"
          >
            {isLoggedIn && hasAttempted ? 'View Result' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  );
}
