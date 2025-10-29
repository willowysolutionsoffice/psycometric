import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/images/psycologo.png" // Replace with your logo path
              alt="India Student Portal"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          {/* Right side - Welcome message and profile */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Welcome. <span className="font-medium">Jon Doe</span>
            </span>
            
            {/* Profile dropdown */}
            <button className="flex items-center gap-2 focus:outline-none">
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-blue-500 overflow-hidden">
                <Image
                  src="/profile.png" // Replace with profile image path
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}