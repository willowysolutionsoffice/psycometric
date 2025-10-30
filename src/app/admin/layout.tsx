import type { Metadata } from "next";
import { APP_CONFIG } from "@/config/app";

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Minimal base layout: no sidebar/header here.
  // The admin shell lives in /admin/(panel)/layout.tsx
  return <>{children}</>;
}


