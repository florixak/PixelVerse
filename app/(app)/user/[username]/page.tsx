import { notFound, redirect } from "next/navigation";
import { getUserByUsername } from "@/sanity/lib/users/getUserByUsername";
import ProfilePage from "../../profile/[clerkId]/page";
import UserProfileContent from "@/components/user/user-profile-content";

type UserProfileRedirectPageProps = {
  params: Promise<{ username: string }>;
};

const UserProfileRedirectPage = async ({
  params,
}: UserProfileRedirectPageProps) => {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user || !user.clerkId) {
    notFound();
  }

  return <UserProfileContent user={user} />;
};

export default UserProfileRedirectPage;
