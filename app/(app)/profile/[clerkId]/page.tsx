import MasonryWrapper from "@/components/masonry-wrapper";
import PostCard from "@/components/post/post-card";
import Role from "@/components/role";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import getLatestActivityOfUser from "@/sanity/lib/featured/getLatestActivityOfUser";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { Calendar, Ellipsis } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

type ProfilePageProps = {
  params: Promise<{ clerkId: string }>;
};

type LatestUserActivityProps = {
  clerkId: string;
  limit?: number;
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { clerkId } = await params;
  if (!clerkId) {
    notFound();
  }
  const user = await getUserByClerkId(clerkId);

  return (
    <section className="flex flex-col w-full max-w-[70rem] mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 gap-12">
      <div className="flex flex-row gap-6 w-full items-start">
        <div className="flex flex-col items-center sm:items-start md:flex-row md:justify-between w-full">
          {/* Avatar and User Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Image
              src={user?.imageUrl || "/avatar-default.svg"}
              alt={`${user?.username}'s avatar`}
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-full object-cover border-4 border-background shadow-md"
              width={192}
              height={192}
              priority
              placeholder="blur"
              blurDataURL="/avatar-default.svg"
            />

            <div className="flex flex-col text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {user?.fullName || user?.username} <Role role={user?.role} />
              </h1>

              <p className="text-muted-foreground text-base">
                @{user?.username || "Unknown User"}
              </p>

              <p
                className={`${
                  user?.createdAt ? "flex" : "hidden"
                } text-muted-foreground items-center text-sm md:text-base gap-1 justify-center sm:justify-start mt-1`}
                title={`Joined on ${formatDate(user?.createdAt)}`}
              >
                <Calendar className="h-4 w-4" /> Joined{" "}
                {formatDate(user?.createdAt)}
              </p>

              {/* Stats on mobile - hidden on desktop */}
              <div className="flex justify-center sm:hidden gap-6 mt-3">
                <div className="flex flex-col items-center">
                  <p className="text-xl font-semibold">
                    {user?.postCount || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-xl font-semibold">
                    {user?.commentCount || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Comments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex flex-col gap-6 mt-0 md:mt-2">
          <div className="flex flex-row items-center gap-4 justify-between">
            <Button className="px-6">Follow</Button>
            <Button variant="outline" size="icon">
              <Ellipsis className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="md:flex flex-row items-center gap-2 hidden">
        <div className="flex flex-col items-end">
          <p className="text-xl md:text-2xl font-semibold">
            {user?.postCount || 0}
          </p>
          <p className="text-sm text-muted-foreground">Posts</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-xl md:text-2xl font-semibold">
            {user?.commentCount || 0}
          </p>
          <p className="text-sm text-muted-foreground">Comments</p>
        </div>
      </div>

      {/* Latest Activity Section */}
      <div className="flex flex-col">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Latest Activity</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          Here are the latest posts and comments made by {user?.username}.
        </p>
        <LatestUserActivity clerkId={clerkId} limit={8} />
      </div>
    </section>
  );
};

const LatestUserActivity = async ({
  clerkId,
  limit,
}: LatestUserActivityProps) => {
  const posts = await getLatestActivityOfUser(clerkId, limit);

  if (!posts || posts.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No posts or comments found for this user.
      </div>
    );
  }

  return (
    <MasonryWrapper>
      {posts.map((post) => (
        <div key={post._id} className="break-inside-avoid mb-4">
          <PostCard post={post} />
        </div>
      ))}
    </MasonryWrapper>
  );
};

export default ProfilePage;
