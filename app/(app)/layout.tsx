import Header from "@/components/header";
import Footer from "@/components/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";
import CommandSearch from "@/components/command-search";
import VisitorTracker from "@/components/analytics/visitor-tracker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Providers from "@/components/providers";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <Providers>
      <Header />
      <CommandSearch />
      <VisitorTracker />
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="relative min-h-screen w-full">
          <SidebarTrigger
            className="fixed top-3 ml-2 z-[60] size-10 rounded-md bg-background border shadow-sm hover:bg-muted transition-colors duration-200"
            aria-label="Toggle sidebar"
          />

          {children}
        </main>
      </SidebarProvider>
      <Footer />
    </Providers>
  );
}
