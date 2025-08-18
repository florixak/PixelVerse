import { Topic, User } from "@/sanity.types";
import { getUserMostActiveTopic } from "@/sanity/lib/posts/getUserMostActiveTopic";
import Link from "next/link";

type UserProfileStatsProps = {
  user: User | null;
};

const UserProfileStats = async ({ user }: UserProfileStatsProps) => {
  if (!user) {
    return null;
  }

  const mostActiveTopic: Topic | null = await getUserMostActiveTopic(
    user.clerkId || "",
    {}
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:flex md:justify-center md:gap-8 lg:gap-12">
        <div className="flex flex-col items-center text-center">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
            {user?.followerCount || 0}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">Followers</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
            {user?.followingCount || 0}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">Following</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
            {user?.postCount || 0}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">Posts</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
            {mostActiveTopic ? (
              <Link
                href={`/topics/${mostActiveTopic.slug}`}
                className="hover:underline truncate max-w-[120px] sm:max-w-[150px] md:max-w-none block"
                title={mostActiveTopic.title}
              >
                {mostActiveTopic.title}
              </Link>
            ) : (
              "None"
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Most Active Topic
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileStats;
