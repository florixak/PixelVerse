import AdminSidebar from "@/components/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { canAccessDashboard } from "@/lib/user-utils";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth checks
  const user = await currentUser();
  const sanityUser = await getUserByClerkId(user?.id || "");
  if (!user || !sanityUser || sanityUser.isBanned || !sanityUser.clerkId) {
    notFound();
  }
  const isAllowed = await canAccessDashboard(sanityUser.clerkId);
  if (!isAllowed) {
    notFound();
  }

  return (
    <>
      <div className="bg-primary/10 p-2 text-primary flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold">PixelVerse Admin</span>
        </div>
        <a href="/" className="text-sm hover:underline">
          Return to App
        </a>
      </div>

      {/*<AdminCommandSearch />*/}

      <div className="flex h-[calc(100vh-40px)]">
        <SidebarProvider defaultOpen={true}>
          <AdminSidebar />
          <main className="relative min-h-screen w-full px-4 mt-6">
            <SidebarTrigger
              className="fixed top-3 z-40 size-10 rounded-md bg-background border shadow-sm hover:bg-muted transition-colors duration-200"
              aria-label="Toggle sidebar"
            />
            {children}
          </main>
        </SidebarProvider>
      </div>
    </>
  );
}
