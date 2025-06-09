import MasonryWrapper from "@/components/masonry-wrapper";
import PostCard from "@/components/post/post-card";
import Role from "@/components/role";
import { Button } from "@/components/ui/button";
import UserProfileContent from "@/components/user/user-profile-content";
import { formatDate } from "@/lib/utils";
import getLatestActivityOfUser from "@/sanity/lib/featured/getLatestActivityOfUser";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { Calendar, Ellipsis } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

type ProfilePageProps = {
  params: Promise<{ clerkId: string }>;
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { clerkId } = await params;
  if (!clerkId) {
    notFound();
  }
  const user = await getUserByClerkId(clerkId);

  return <UserProfileContent user={user} />;
};

export default ProfilePage;
