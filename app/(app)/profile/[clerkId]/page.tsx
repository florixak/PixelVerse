import PostCard from "@/components/post/post-card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import getLatestActivityOfUser from "@/sanity/lib/featured/getLatestActivityOfUser";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { Calendar, Ellipsis } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

type ProfilePageProps = {
  params: Promise<{
    clerkId: string;
  }>;
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
    <section className="flex flex-col">
      <div className="flex flex-col items-center md:flex-row md:justify-between md:items-start w-ful md:px-32">
        <div className="flex flex-col md:flex-row items-center">
          <Image
            src={user?.imageUrl || "/avatar-default.svg"}
            alt={`${user?.username}'s avatar`}
            className="w-48 h-48 rounded-full md:mr-8"
            width={192}
            height={192}
            loading="lazy"
            placeholder="blur"
            blurDataURL="/avatar-default.svg"
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-semibold">
              {user?.fullName || user?.username}
            </h1>
            <p className="text-muted-foreground text-base">
              @{user?.username || "Unknown User"}
            </p>
            <p
              className={`${
                user?.createdAt ? "block" : "hidden"
              } text-muted-foreground flex items-center text-base gap-1`}
              title={`Joined on ${formatDate(user?.createdAt)}`}
            >
              <Calendar size={16} /> Joined on {formatDate(user?.createdAt)}
            </p>
            <div className="flex flex-row justify-center md:justify-end gap-4">
              <div className="flex flex-col items-end">
                <p className="text-2xl font-semibold">{user?.postCount || 0}</p>
                <p className="text-muted-foreground">Posts</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-2xl font-semibold">
                  {user?.commentCount || 0}
                </p>
                <p className="text-muted-foreground">Comments</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 mt-5">
          <Button>Follow</Button>
          <Button variant="outline">
            <Ellipsis />
          </Button>
        </div>
      </div>
      <div className="flex flex-col mt-8 px-10 sm:px-20 md:px-32">
        <h2 className="text-2xl font-semibold">Latest Activity</h2>
        <p className="text-muted-foreground">
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

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-4 mt-6 space-y-4">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="break-inside-avoid mb-4">
            <PostCard post={post} />
          </div>
        ))
      ) : (
        <div className="text-gray-500">No posts found for this topic.</div>
      )}
    </div>
  );
};

export default ProfilePage;
