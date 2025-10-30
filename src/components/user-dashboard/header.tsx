"use client"
import Image from 'next/image';
import { ChevronDown, User, Key, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserLogoutModal from "@/components/auth/user-logout-modal";

export default function Header() {
  const [userName] = useState<string>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
      if (!raw) return '';
      const user = JSON.parse(raw) as { name?: string };
      return user?.name ?? '';
    } catch {
      return '';
    }
  });
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <Image
                src="/images/psycologo.png" // Replace with your logo path
                alt="India Student Portal"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
          </Link>

          {/* Right side - Welcome message and profile */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Welcome. <span className="font-medium">{userName || 'User'}</span>
            </span>
            
            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 focus:outline-none">
                  <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-blue-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3">
                  <Key className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">Update Password</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3" onClick={() => setLogoutOpen(true)}>
                  <LogOut className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
    <UserLogoutModal open={logoutOpen} setOpen={setLogoutOpen} />
    </>
  );
}