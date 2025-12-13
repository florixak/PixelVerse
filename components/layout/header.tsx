import { ThemeSwitcher } from "../theme-switcher";
import AuthButtons from "../auth-buttons";
import HeaderSearch from "../header-search";
import NotificationSystem from "../notification/notification-system";
import { getQueryClient } from "@/lib/get-query-client";
import {
  getNotifications,
  getUnreadNotificationCount,
} from "@/actions/notification-actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ensureSanityUser } from "@/lib/user-utils";

const Header = async () => {
  const user = await ensureSanityUser();

  const queryClient = getQueryClient();
  if (user) {
    try {
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: ["unread-notifications"],
          queryFn: getUnreadNotificationCount,
        }),
        queryClient.prefetchQuery({
          queryKey: ["notifications"],
          queryFn: () => getNotifications(10),
        }),
      ]);
    } catch (error) {
      console.error("Error prefetching notifications:", error);
    }
  }
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16 border-b border-muted/20 w-full z-50 bg-background dark:bg-background/50 backdrop-blur-xs">
      <HeaderSearch />
      <AuthButtons />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotificationSystem />
      </HydrationBoundary>
      <ThemeSwitcher />
    </header>
  );
};

export default Header;
