import UserProfileContent from "@/components/user/user-profile-content";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { SortOrder } from "@/types/filter";
import { currentUser } from "@clerk/nextjs/server";

import { notFound } from "next/navigation";

type ProfilePageProps = {
  params: Promise<{ clerkId: string }>;
  searchParams: Promise<{ sort?: SortOrder }>;
};

const ProfilePage = async ({ params, searchParams }: ProfilePageProps) => {
  const { clerkId } = await params;
  if (!clerkId) {
    notFound();
  }
  let user = await getUserByClerkId(clerkId);
  if (!user && clerkId !== "me") {
    notFound();
  }
  if (!user && clerkId === "me") {
    const currUser = await currentUser();
    if (!currUser || !currUser.id) {
      notFound();
    }
    user = await getUserByClerkId(currUser?.id);
  }

  const { sort = "latest" } = await searchParams;

  return <UserProfileContent targetUser={user} sort={sort} />;
};

export default ProfilePage;
