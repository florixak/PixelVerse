import Header from "@/components/header";
import Footer from "@/components/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";
import Providers from "@/components/providers";
import { auth } from "@clerk/nextjs/server";
import { ensureSanityUser } from "@/lib/user-utils";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const { userId } = await auth();
  if (userId) {
    await ensureSanityUser(userId);
  }

  return (
    <Providers>
      <Header />
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
