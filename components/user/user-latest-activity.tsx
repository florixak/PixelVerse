import getLatestActivityOfUser from "@/sanity/lib/featured/getLatestActivityOfUser";
import MasonryWrapper from "../masonry-wrapper";
import PostCard from "../post/post-card";

type LatestUserActivityProps = {
  clerkId: string | undefined;
  limit?: number;
};

const LatestUserActivity = async ({
  clerkId,
  limit,
}: LatestUserActivityProps) => {
  const NoPosts = () => (
    <div className="py-8 text-center text-muted-foreground">
      No user activity found.
    </div>
  );

  if (!clerkId) {
    return <NoPosts />;
  }

  const posts = await getLatestActivityOfUser(clerkId, limit);

  if (!posts || posts.length === 0) {
    return <NoPosts />;
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

export default LatestUserActivity;
