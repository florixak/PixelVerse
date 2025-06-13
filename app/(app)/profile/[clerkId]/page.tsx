import UserProfileContent from "@/components/user/user-profile-content";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { currentUser } from "@clerk/nextjs/server";

import { notFound } from "next/navigation";

type ProfilePageProps = {
  params: Promise<{ clerkId: string }>;
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
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

  return <UserProfileContent user={user} />;
};

export default ProfilePage;
