"use client";

import { useSidebar } from "../ui/sidebar";
import { MoreHorizontal } from "lucide-react";

const AppSidebarHint = () => {
  const { open, isMobile } = useSidebar();

  return open || isMobile ? (
    <span className="text-xs text-muted-foreground mt-2 block px-2">
      Login to see more options...
    </span>
  ) : (
    <div
      className="flex items-center justify-center w-full mt-2"
      aria-hidden="true"
    >
      <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
    </div>
  );
};

export default AppSidebarHint;
