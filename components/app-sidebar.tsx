import { Home, Newspaper, Search, ShieldCheck, User } from "lucide-react";

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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Suspense } from "react";

import { CollapsibleUserCard } from "./collapsible-user-card";
import { getPopularTopics } from "@/sanity/lib/featured/getPopularTopics";
import { currentUser } from "@clerk/nextjs/server";
import { canAccessDashboard } from "@/lib/user-utils";
import SidebarHeader from "./sidebar-header";

const menu: {
  title: string;
  url: string;
  icon: React.ComponentType;
  adminOnly?: boolean;
  loggedInOnly?: boolean;
}[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/profile/me",
    icon: User,
    loggedInOnly: true,
  },
  {
    title: "Topics",
    url: "/topics",
    icon: Newspaper,
  },
  {
    title: "Explore",
    url: "/explore",
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

              <span className="text-xs text-muted-foreground flex items-center gap-4">
                <span>{item.postCount} posts</span>
                {item.postCountWeek !== undefined && item.postCountWeek > 0 ? (
                  <span>+{item.postCountWeek} last week</span>
                ) : null}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}

export async function AppSidebar() {
  let user = null;
  let isAdmin = false;

  try {
    user = await currentUser();
    if (user) {
      isAdmin = await canAccessDashboard(user.id);
    }
  } catch (error) {}

  return (
    <Sidebar collapsible="icon" key={user?.id || "guest"}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => {
                if (
                  (item.adminOnly && !isAdmin) ||
                  (item.loggedInOnly && !user)
                ) {
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
