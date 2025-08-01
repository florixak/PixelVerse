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
    <div className="flex flex-col md:flex-row items-center mx-auto md:items-center justify-center gap-4 md:gap-8 lg:gap-12 text-center mt-6">
      <div className="flex flex-row items-end gap-4 md:gap-8 lg:gap-12">
        <div className="flex flex-col items-end">
          <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
            {user?.followerCount || 0}
          </p>
          <p className="text-sm text-muted-foreground">Followers</p>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
            {user?.followingCount || 0}
          </p>
          <p className="text-sm text-muted-foreground">Following</p>
        </div>
      </div>

      <div className="flex flex-row items-end gap-4 md:gap-8 lg:gap-12">
        <div className="flex flex-col items-end">
          <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
            {user?.postCount || 0}
          </p>
          <p className="text-sm text-muted-foreground">Posts</p>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
            {mostActiveTopic ? (
              <Link href={`/topics/${mostActiveTopic.slug}`}>
                {mostActiveTopic.title}
              </Link>
            ) : (
              "None"
            )}
          </p>
          <p className="text-sm text-muted-foreground">Most Active Topic</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileStats;
