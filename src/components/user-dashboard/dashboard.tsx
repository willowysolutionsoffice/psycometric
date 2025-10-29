import React from 'react';
import Image from 'next/image';

export default function PsychometricDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section with Coral/Red Background */}
        <div className="bg-linear-to-r from-red-400 to-red-500 rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Brain Illustration Image */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <Image
                  src="/images/dashboard-img.png" // Replace with your image path
                  alt="Psychometric Assessment Brain Diagram"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            {/* Right Side - Text Content */}
            <div className="text-white space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold">
                Psychometric Assessment
              </h1>
              
              <p className="text-lg leading-relaxed opacity-95">
                Discover yourself and find out who you are, how you are, and what you can be with our psychometric assessments!
              </p>
              
              <p className="text-base leading-relaxed opacity-90">
                Our Psychometric and Career Assessment is based on globally reliable and validated career test theories on Interest, Aptitude, Personality, and Multiple Intelligences. These assessments are further fine-tuned to meet the global standards by a panel of career counsellors, psychologists, and research team (aka the really smart people). So relax and trust us with your future.
              </p>
            </div>
          </div>
        </div>
        
        {/* Get Started Button */}
        <div className="flex justify-center mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-4 rounded-lg shadow-lg transition-colors duration-200 text-lg">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}