"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/user-dashboard/header";

export default function ClientHeader() {
  const pathname = usePathname();
  
  // Don't show header on admin pages or auth pages
  const hideHeader = pathname.startsWith('/admin') || 
                    pathname.startsWith('/login') || 
                    pathname.startsWith('/sign-up');
  
  if (hideHeader) {
    return null;
  }
  
  return <Header />;
}
