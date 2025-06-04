import { Post, User } from "@/sanity.types";
import Image from "next/image";
import PostReactions from "./post-reactions";

type PostContentProps = {
  post: Post;
  userId?: User["_id"];
};

const PostContent = ({ post, userId }: PostContentProps) => {
  return (
    <div className="w-full">
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title || "Post Image"}
          className="object-contain max-h-[70vh] rounded-md"
          width={800}
          height={600}
          loading="lazy"
          placeholder="blur"
          blurDataURL={post.imageUrl}
        />
      )}

      <p className="text-lg text-muted-foreground mt-4">
        {"No content available for this post."}
      </p>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-muted text-foreground text-sm px-2 py-1 rounded-full mr-2 mb-2"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4">
        <PostReactions
          postId={post._id}
          reactions={post.reactions || []}
          currentUserClerkId={userId}
        />
      </div>

      {post.dimensions && (
        <div className="mt-4 text-sm text-muted-foreground">
          {
            <p>
              Dimensions: {post.dimensions.width + "x" + post.dimensions.height}
            </p>
          }
        </div>
      )}
      {post.software && (
        <p>Created with: {post.software.map((sw) => sw).join(", ")}</p>
      )}
    </div>
  );
};

export default PostContent;
