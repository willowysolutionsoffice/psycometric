"use client";

import Link from "next/link";
import { IconInnerShadowTop } from "@tabler/icons-react";

import { NavMain } from "@/components/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SIDEBAR_DATA, COMPANY_INFO } from "@/constants/navigation";
import { UserProfile } from "@/types/user";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: UserProfile;
}

export function AppSidebar({ ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader  className="bg-secondary text-secondary-foreground">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">
                  {COMPANY_INFO.name}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SIDEBAR_DATA.navMain} />

      </SidebarContent>
        {/* <SidebarFooter className="bg-sidebar-primary text-primary-foreground"><NavUser /></SidebarFooter> */}
    </Sidebar>
  );
}
