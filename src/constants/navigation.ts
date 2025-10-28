import {
  IconCategory,
  IconChartBar,
  IconDashboard,
  IconQuestionMark,
  IconUser,
  IconSchool,
} from "@tabler/icons-react";
import type { SidebarData } from "@/types/navigation";
import { APP_CONFIG } from "@/config/app";

export const SIDEBAR_DATA: SidebarData = {
  // main navigation for all users
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: IconCategory,
    },
    {
      title: "Streams",
      url: "/admin/streams",
      icon: IconSchool,
    },
    {
      title: "Questionaries",
      url: "/admin/questionaries",
      icon: IconQuestionMark,
    },
    {
      title: "Students",
      url: "/admin/students",
      icon: IconUser,
    },
    {
      title: "Results",
      url: "/admin/results",
      icon: IconChartBar,
    },
  ],
};

export const COMPANY_INFO = {
  name: APP_CONFIG.name,
  description: APP_CONFIG.description,
} as const;
