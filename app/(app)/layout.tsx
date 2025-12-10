import Header from "@/components/header";
import Footer from "@/components/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";
import Providers from "@/components/providers";
import SidebarTriggerWrapper from "@/components/sidebar-trigger-wrapper";

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
