import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft, Home, Newspaper, TriangleAlert, User } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { CollapsibleUserCard } from "./collapsible-user-card";
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
    title: "Suggested Topics",
    url: "/admin/suggested-topics",
    icon: Newspaper,
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: TriangleAlert,
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
