import {
  Home,
  Newspaper,
  Search,
  ShieldCheck,
  TriangleAlert,
  User,
} from "lucide-react";

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
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { canAccessDashboard } from "@/lib/user-utils";
import SidebarHeader from "./sidebar-header";
import Image from "next/image";

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
    title: "My Reports",
    url: "/my-reports",
    icon: TriangleAlert,
    loggedInOnly: true,
  },
  {
    title: "Admin",
    url: "/admin",
    icon: ShieldCheck,
    loggedInOnly: true,
    adminOnly: true,
  },
];

const TopicGroup = async () => {
  const popularTopics = await getPopularTopics();

  if (!popularTopics || popularTopics.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Popular Topics</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {popularTopics.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={`/topics/${item.slug}`}>
                  {item.iconUrl ? (
                    <Image
                      src={item.iconUrl}
                      alt={item.title + " icon"}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                  ) : null}
                  <span>{item.title}</span>

                  <span className="text-xs text-muted-foreground flex items-center gap-4">
                    <span>{item.postCount} posts</span>
                    {item.postCountWeek !== undefined &&
                    item.postCountWeek > 0 ? (
                      <span>+{item.postCountWeek} last week</span>
                    ) : null}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export async function AppSidebar() {
  let user = null;
  let isAdmin = false;

  try {
    user = await currentUser();
    if (user) {
      isAdmin = await canAccessDashboard(user.id);
    }
  } catch {}

  return (
    <Sidebar collapsible="icon" key={user?.id || "no-user"}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => {
                const adminOnly = item.adminOnly || false;
                const loggedInOnly = item.loggedInOnly || false;
                if ((adminOnly && !isAdmin) || (loggedInOnly && !user)) {
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
              {user ? null : (
                <span className="text-xs text-muted-foreground mt-2 block px-2">
                  Login to see more options...
                </span>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Suspense fallback={null}>
          <TopicGroup />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <CollapsibleUserCard />
      </SidebarFooter>
    </Sidebar>
  );
}
