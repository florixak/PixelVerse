import { Post, User } from "@/sanity.types";
import Image from "next/image";
import PostReactions from "./post-reactions";
import { Separator } from "../ui/separator";
import PostTags from "./post-tags";

type PostContentProps = {
  post: Post;
  userId?: User["_id"];
};

const PostContent = ({ post, userId }: PostContentProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title || "Post Image"}
          className="object-contain max-h-[70vh] rounded-md mx-auto"
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

      <PostTags tags={post.tags} />

      <Separator />

      <PostReactions
        postId={post._id}
        reactions={post.reactions || []}
        currentUserClerkId={userId}
        commentsCount={post.commentsCount || 0}
      />

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
