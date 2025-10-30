import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/common/site-header";
import { APP_CONFIG, theme } from "@/config/app";
import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserProfile } from "@/types/user";

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
};

export default async function AdminPanelLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
     headers: await headers(),
  });
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("admin_session");
  interface AdminSessionUser { role?: string }
  const user = session?.user as AdminSessionUser | undefined;
  const isAdmin = !!user && (user.role ?? "").toLowerCase() === "admin";
  if (!isAdmin && !adminCookie) {
    redirect("/admin/login");
  }
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": theme.sidebarWidth,
          "--header-height": theme.headerHeight,
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="floating" user={session?.user as UserProfile}/>
      <SidebarInset>
        <SiteHeader />
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}



