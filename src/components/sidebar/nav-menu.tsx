"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavItem } from "@/types/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavMenuProps {
  items: NavItem[];
}

export const NavMenu = ({ items, ...rest }: NavMenuProps) => {
  const pathname = usePathname();
  
  return (
    <SidebarMenu {...rest}>
      {items.map((item) =>
        item.children ? (
          <SubMenu key={item.title} item={item} />
        ) : (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton 
              asChild 
              isActive={pathname === item.url}
              className={pathname === item.url 
                ? "!bg-primary !text-primary-foreground hover:!bg-primary/90" 
                : "hover:bg-muted hover:text-foreground"
              }
            >
              <Link href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ),
      )}
    </SidebarMenu>
  );
};

const SubMenu = ({ item }: { item: NavItem }) => {
  const pathname = usePathname();
  const isActive = pathname === item.url || item.children?.some((child: NavItem) => 
    pathname === child.url || (child.children && child.children.some((grandChild: NavItem) => pathname === grandChild.url))
  );
  
  return (
    <Collapsible key={item.title} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={isActive}
            className={isActive 
              ? "!bg-primary !text-primary-foreground hover:!bg-primary/90" 
              : "hover:bg-muted hover:text-foreground"
            }
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
      </SidebarMenuItem>

      <CollapsibleContent>
        <SidebarMenuSub>
          {item.children!.map((subItem: NavItem) =>
            subItem.children ? (
              <SidebarMenuSubItem key={subItem.url}>
                <SubMenu item={subItem} />
              </SidebarMenuSubItem>
            ) : (
              <SidebarMenuSubItem key={subItem.url}>
                <SidebarMenuSubButton 
                  asChild 
                  isActive={pathname === subItem.url}
                  className={pathname === subItem.url 
                    ? "!bg-primary !text-primary-foreground hover:!bg-primary/90" 
                    : "hover:bg-muted hover:text-foreground"
                  }
                >
                  <Link href={subItem.url}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ),
          )}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
};
