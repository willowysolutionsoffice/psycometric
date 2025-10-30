"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app";
import { User, Key, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { LogoutDialog } from "@/components/auth/logout-modal";

const { defaultTitle } = APP_CONFIG.siteHeader;

interface SiteHeaderProps {
  title?: string;
}

export function SiteHeader({ title = defaultTitle }: SiteHeaderProps = {}) {
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      try { localStorage.removeItem('authUser'); } catch {}
    } finally {
      setLogoutOpen(false);
      router.push('/admin/login');
    }
  };

  return (
    <>
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 focus:outline-none">
                <div className="w-9 h-9 rounded-full bg-gray-200 border-2 border-blue-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2">
                <Key className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Update Password</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
    
    {/* Logout modal intentionally not used; performing instant logout */}
    </>
  );
}
