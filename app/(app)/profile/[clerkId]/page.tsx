import PostCard from "@/components/post-card";
import getLatestActivityOfUser from "@/sanity/lib/featured/getLatestActivityOfUser";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {clerkId === user?.id ? "Your " : `${user.username}'s `} Profile
      </h1>
      <div className="flex items-center mb-6">
        <img
          src={user.imageUrl || "/default-avatar.png"}
          alt={`${user.username}'s avatar`}
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.username}</h2>
        </div>
      </div>

      <div>
        <h2>Latest activity</h2>
        <p className="text-gray-600">
          This section will show the latest activity of {user.username}.
        </p>
        <Suspense fallback={<div>Loading latest activity...</div>}>
          <LatestUserActivity clerkId={clerkId} limit={6} />
        </Suspense>
      </div>
    </div>
  );
};

const LatestUserActivity = async ({
  clerkId,
  limit,
}: LatestUserActivityProps) => {
  const posts = await getLatestActivityOfUser(clerkId, limit);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} className="w-full" />
      ))}
    </div>
  );
};

export default ProfilePage;
