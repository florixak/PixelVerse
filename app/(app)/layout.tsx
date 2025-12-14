import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { cookies } from "next/headers";
import Providers from "@/components/layout/providers";
import SidebarTriggerWrapper from "@/components/layout/sidebar-trigger-wrapper";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state")?.value;
  const defaultOpen =
    sidebarState === undefined ? true : sidebarState === "true";

  return (
    <Providers>
      <Header />
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="relative min-h-screen w-full">
          <SidebarTriggerWrapper />
          {children}
        </main>
      </SidebarProvider>
      <Footer />
    </Providers>
  );
}
