"use client";

import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import UserCard from "./user-card";

export function CollapsibleUserCard() {
  const { open, isMobile } = useSidebar();
  return <UserCard collapsed={!open && !isMobile} />;
}
