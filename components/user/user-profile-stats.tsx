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
    <div className="flex flex-row items-center justify-center sm:justify-start gap-4 mt-4">
      <div className="flex flex-col items-end">
        <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
          {user?.postCount || 0}
        </p>
        <p className="text-sm text-muted-foreground">Posts</p>
      </div>
      {/*<div className="flex flex-col items-end">
        <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
          {user?.commentCount || 0}
        </p>
        <p className="text-sm text-muted-foreground">Comments</p>
      </div>*/}
      <div className="flex flex-col items-end">
        <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
          {user?.receivedLikes || 0}
        </p>
        <p className="text-sm text-muted-foreground">Likes</p>
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
  );
};

export default UserProfileStats;
