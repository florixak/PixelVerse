import PostAuthorButtons from "@/components/post-author-buttons";
import PostReactions from "@/components/post-reactions";
import { formatDate } from "@/lib/utils";
import getPostBySlug from "@/sanity/lib/posts/getPostBySlug";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";

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
    <div className="relative p-6 flex-center w-full flex-col">
      {post.author?.clerkId === user?.id && (
        <PostAuthorButtons postId={post._id} />
      )}
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold">
          {post.title}
          {post.isOriginal && (
            <span
              className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium"
              title="This post is marked as an original creation by the author"
            >
              Original
            </span>
          )}
        </h1>

        <p className="text-gray-500 mb-2">
          {post.author?.username} on{" "}
          {formatDate(post.publishedAt || post._createdAt)}
        </p>
        <p>{post.excerpt || "No excerpt available for this post."}</p>
      </div>

      <div className="max-w-2xl w-full mt-6">
        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt={post.title || "Post Image"}
            className="w-full rounded-lg mt-4"
            width={800}
            height={450}
            loading="lazy"
            placeholder="blur"
            blurDataURL={post.imageUrl}
          />
        )}
        <PostReactions
          postId={post._id}
          reactions={post.reactions || []}
          currentUserClerkId={user?.id || ""}
        />
      </div>
    </div>
  );
};

export default PostPage;
