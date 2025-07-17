import PostComments from "@/components/post/post-comments";
import PostContent from "@/components/post/post-content";
import PostHeader from "@/components/post/post-header";
import getPostBySlug from "@/sanity/lib/posts/getPostBySlug";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

const getCachedPostBySlug = cache(async (postSlug: string, userId?: string) => {
  return await getPostBySlug(postSlug, userId);
});

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ postSlug: string }>;
}) => {
  const { postSlug } = await params;

  const user = await currentUser();
  const post = await getCachedPostBySlug(
    decodeURIComponent(postSlug),
    user?.id
  );

  return {
    title: post.title,
    description:
      post.content ||
      `Check out "${post.title}" on PixelVerse - a pixel art community.`,
    openGraph: {
      title: `${post.title} - PixelVerse`,
      description:
        post.content || `Discover this amazing pixel art: ${post.title}`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/topics/${post.topicSlug}/${post.slug}`,
      images: post.imageUrl
        ? [
            {
              url: post.imageUrl,
              width: 800,
              height: 600,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      title: post.title,
      description:
        post.content || `Check out this amazing pixel art: ${post.title}`,
      card: "summary_large_image",
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
  };
};

const PostPage = async ({
  params,
}: {
  params: Promise<{ postSlug: string }>;
}) => {
  const { postSlug } = await params;
  const user = await currentUser();
  const post = await getCachedPostBySlug(
    decodeURIComponent(postSlug),
    user?.id
  );

  if (!post) {
    notFound();
  }

  return (
    <section className="relative max-w-4xl mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-2 border border-muted rounded-lg p-4 bg-background">
        <Suspense fallback={<p>Loading post...</p>}>
          <PostHeader
            post={post}
            isAuthor={post.author?.clerkId === user?.id}
          />
        </Suspense>

        <PostContent post={post} userId={user?.id} />
      </div>

      <Suspense fallback={<p>Loading comments...</p>}>
        <PostComments post={post} />
      </Suspense>
    </section>
  );
};

export default PostPage;
