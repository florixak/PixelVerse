import AdminSidebar from "@/components/admin-sidebar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { canAccessDashboard } from "@/lib/user-utils";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      redirect("/");
    }

    const sanityUser = await getUserByClerkId(userId);
    if (!sanityUser || sanityUser.isBanned || !sanityUser.clerkId) {
      redirect("/");
    }

    const isAllowed = await canAccessDashboard(sanityUser.clerkId);
    if (!isAllowed) {
      redirect("/");
    }
  } catch (error) {
    console.log("Auth check failed, redirecting:", error);
    redirect("/");
  }

  return (
    <>
      <Header />
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
      <Footer />
    </>
  );
}
