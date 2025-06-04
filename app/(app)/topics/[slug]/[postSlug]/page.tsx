import PostComments from "@/components/post/post-comments";
import PostContent from "@/components/post/post-content";
import PostHeader from "@/components/post/post-header";
import getPostBySlug from "@/sanity/lib/posts/getPostBySlug";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const PostPage = async ({
  params,
}: {
  params: Promise<{ postSlug: string }>;
}) => {
  const { postSlug } = await params;
  const user = await currentUser();
  const post = await getPostBySlug(postSlug, user?.id);

  if (!post) {
    notFound();
  }

  return (
    <section className="relative max-w-4xl mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-2 border border-muted rounded-lg p-4 bg-background">
        <PostHeader post={post} isAuthor={post.author?.clerkId === user?.id} />

        <PostContent post={post} userId={user?.id} />
      </div>

      <Suspense fallback={<p>Loading comments...</p>}>
        <PostComments post={post} />
      </Suspense>
    </section>
  );
};

export default PostPage;
