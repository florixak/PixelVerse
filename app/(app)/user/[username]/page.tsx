import { notFound } from "next/navigation";
import { getUserByUsername } from "@/sanity/lib/users/getUserByUsername";
import UserProfileContent from "@/components/user/user-profile-content";
import { SortOrder } from "@/types/filter";
import { cache } from "react";

type UserProfileRedirectPageProps = {
  params: Promise<{ username: string; sort?: SortOrder }>;
};

const getCachedUserByUsername = cache(async (username: string) => {
  const user = await getUserByUsername(username);
  if (!user || !user.clerkId) {
    notFound();
  }
  return user;
});

export const generateMetadata = async ({
  params,
}: UserProfileRedirectPageProps) => {
  const { username } = await params;

  const user = await getCachedUserByUsername(username);

  return {
    title: `${user.fullName}'s Profile`,
    description:
      user.bio ||
      `Explore ${user.fullName}'s profile on PixelVerse. Discover their posts, stats, and more.`,
    openGraph: {
      title: `${user.fullName}'s Profile`,
      description:
        user.bio ||
        `Explore ${user.fullName}'s profile on PixelVerse. Discover their posts, stats, and more.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/user/${user.username}`,
      images: [
        {
          url: user.imageUrl || "",
          width: 800,
          height: 600,
          alt: `${user.fullName}'s Avatar`,
        },
      ],
    },
    twitter: {
      title: `${user.fullName}'s Profile`,
      description:
        user.bio ||
        `Explore ${user.fullName}'s profile on PixelVerse. Discover their posts, stats, and more.`,
      card: "summary_large_image",
      images: [user.imageUrl || ""],
    },
  };
};

const UserProfileRedirectPage = async ({
  params,
}: UserProfileRedirectPageProps) => {
  const { username, sort = "latest" } = await params;
  const user = await getCachedUserByUsername(username);

  return <UserProfileContent user={user} sort={sort} />;
};

export default UserProfileRedirectPage;
