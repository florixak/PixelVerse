"use client";

import { SidebarTrigger, useSidebar } from "../ui/sidebar";

const SidebarTriggerWrapper = () => {
  const { openMobile, isMobile } = useSidebar();

  if (isMobile && openMobile) return null;

  return (
    <SidebarTrigger
      className="fixed top-3 ml-2 z-[60] size-10 rounded-md bg-background border shadow-sm hover:bg-muted transition-colors duration-200"
      aria-label="Toggle sidebar"
    />
  );
};

export default SidebarTriggerWrapper;
