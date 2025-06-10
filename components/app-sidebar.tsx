import { Home, Newspaper, Search, ShieldCheck } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import PixelVerse from "@/public/pixelverse.png";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { CollapsibleUserCard } from "./collapsible-user-card";
import { getPopularTopics } from "@/sanity/lib/featured/getPopularTopics";
import { currentUser } from "@clerk/nextjs/server";
import { canAccessDashboard } from "@/lib/user-utils";

const menu: {
  title: string;
  url: string;
  icon: React.ComponentType;
  adminOnly?: boolean;
}[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Topics",
    url: "/topics",
    icon: Newspaper,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Admin",
    url: "/admin",
    icon: ShieldCheck,
    adminOnly: true,
  },
];

async function TopicsList() {
  const popularTopics = await getPopularTopics();

  return (
    <>
      {popularTopics.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link href={`/topics/${item.slug}`}>
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}

export async function AppSidebar() {
  const user = await currentUser();
  const isAdmin = user ? await canAccessDashboard(user.id) : false;

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
                if (item.adminOnly && !isAdmin) {
                  return null;
                }
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
        <SidebarGroup>
          <SidebarGroupLabel>Popular Topics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Suspense fallback={<div>Loading topics...</div>}>
                <TopicsList />
              </Suspense>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <CollapsibleUserCard />
      </SidebarFooter>
    </Sidebar>
  );
}
