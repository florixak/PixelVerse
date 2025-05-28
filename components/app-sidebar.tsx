import { Calendar, Home, Newspaper, Search, Settings } from "lucide-react";

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
import PixelDit from "@/public/pixeldit.png";
import UserCard from "./user-card";
import Image from "next/image";
import Link from "next/link";
import { cache, Suspense } from "react";
import { getTopics } from "@/data/dummyData";

const menu = [
  {
    title: "Topics",
    url: "/topics",
    icon: Home,
  },
  {
    title: "Newest",
    url: "/topics?order=newest",
    icon: Newspaper,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

async function TopicsList() {
  const items = await getTopics(5);

  return (
    <>
      {items.map((item) => (
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
  return (
    <Sidebar>
      <SidebarHeader>
        <Image src={PixelDit} alt="PixelDit Logo" width={120} height={120} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Your Topics</SidebarGroupLabel>
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
        <UserCard />
      </SidebarFooter>
    </Sidebar>
  );
}
