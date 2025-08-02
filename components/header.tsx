import { ThemeSwitcher } from "./theme-switcher";
import AuthButtons from "./auth-buttons";
import HeaderSearch from "./header-search";
import NotificationSystem from "./notification/notification-system";
import { getQueryClient } from "@/lib/get-query-client";
import { getUnreadNotificationCount } from "@/actions/notification-actions";
import { currentUser } from "@clerk/nextjs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const Header = async () => {
  const user = await currentUser();

  const queryClient = getQueryClient();
  if (user) {
    await queryClient.prefetchQuery({
      queryKey: ["unread-notifications"],
      queryFn: getUnreadNotificationCount,
    });
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
