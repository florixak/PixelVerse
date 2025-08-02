"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { getUnreadNotificationCount } from "@/actions/notification-actions";
import NotificationPermPrompt from "./notification-perm-prompt";
import NotificationMenu from "./notification-menu";

const NotificationSystem = () => {
  const { isSignedIn } = useAuth();

  const { data: countData } = useQuery({
    queryKey: ["unread-notifications"],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30000,
    enabled: isSignedIn,
  });

  const unreadCount = countData?.count || 0;

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="relative">
      <NotificationMenu unreadCount={unreadCount} isSignedIn={isSignedIn} />

      <NotificationPermPrompt
        isSignedIn={isSignedIn}
        unreadCount={unreadCount}
      />
    </div>
  );
};

export default NotificationSystem;
