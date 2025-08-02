import { Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/actions/notification-actions";
import { getQueryClient } from "@/lib/get-query-client";
import Notification from "./notification";
import { Notification as NotificationType } from "@/sanity.types";

type NotificationMenuProps = {
  unreadCount: number;
  isSignedIn: boolean;
};

const NotificationMenu = ({
  unreadCount,
  isSignedIn,
}: NotificationMenuProps) => {
  const queryClient = getQueryClient();
  const { data: notificationsData } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(10),
    enabled: isSignedIn,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    },
  });

  const notifications = notificationsData?.data || [];

  const handleClick = (notification: NotificationType) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 max-h-96 overflow-y-auto"
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
              >
                Mark all read
              </Button>
            )}
          </div>

          {notifications.length > 0 ? (
            <>
              {notifications.slice(0, 5).map((notification) => (
                <Notification
                  key={notification._id}
                  notification={notification}
                  onClick={handleClick}
                />
              ))}

              <DropdownMenuSeparator />

              {notifications.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2"
                  asChild
                >
                  <Link href="/notifications">View All Notifications</Link>
                </Button>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No notifications yet
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
