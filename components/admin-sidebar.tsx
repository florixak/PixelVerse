import { CollapsibleUserCard } from "./collapsible-user-card";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  Sidebar,
} from "./ui/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowLeft, Home, Settings, TriangleAlert, User } from "lucide-react";
import SidebarHeader from "./sidebar-header";

const menu: {
  title: string;
  url: string;
  icon: React.ComponentType;
  adminOnly?: boolean;
}[] = [
  {
    title: "Return to Site",
    url: "/",
    icon: ArrowLeft,
  },
  {
    title: "Dashboard",
    url: "/admin/",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: User,
    adminOnly: true,
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: TriangleAlert,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

const AdminSiderbar = async () => {
  const user = await currentUser();

  return (
    <Sidebar collapsible="icon" key={user?.id || "guest"}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <CollapsibleUserCard />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSiderbar;
