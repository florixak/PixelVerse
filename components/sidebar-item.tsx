"use client";

import React from "react";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";
import Link from "next/link";
import { Item } from "./app-sidebar";
import {
  Home,
  Newspaper,
  Search,
  ShieldCheck,
  TriangleAlert,
  User,
} from "lucide-react";

type SidebarItemProps = {
  item: Item;
  isLoggedIn: boolean;
  isAdmin: boolean;
};

const ICONS: Record<string, React.ComponentType> = {
  Home,
  Newspaper,
  Search,
  ShieldCheck,
  TriangleAlert,
  User,
};

const SidebarItem = ({ item, isLoggedIn, isAdmin }: SidebarItemProps) => {
  const { toggleSidebar, isMobile } = useSidebar();

  const handleClick = () => {
    if (!isMobile) return;
    toggleSidebar();
  };

  const { title, url, icon, adminOnly, loggedInOnly } = item;
  if ((adminOnly && !isAdmin) || (loggedInOnly && !isLoggedIn)) {
    return null;
  }
  const Icon = ICONS[icon];
  return (
    <SidebarMenuItem key={title}>
      <SidebarMenuButton asChild>
        <Link
          href={url}
          onClick={handleClick}
          className="flex items-center gap-2"
        >
          <Icon />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarItem;
