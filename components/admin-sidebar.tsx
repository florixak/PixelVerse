import { CollapsibleUserCard } from "./collapsible-user-card";
import {
  SidebarHeader,
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
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import PixelVerse from "@/public/pixelverse.png";
import Link from "next/link";
import { Home, Newspaper, Settings, User } from "lucide-react";

const menu: {
  title: string;
  url: string;
  icon: React.ComponentType;
  adminOnly?: boolean;
}[] = [
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
    title: "Posts",
    url: "/admin/posts",
    icon: Newspaper,
    adminOnly: true,
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
      <SidebarHeader>
        <Link href="/">
          <Image
            src={PixelVerse}
            alt="PixelVerse Logo"
            width={120}
            height={120}
          />
        </Link>
      </SidebarHeader>
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
