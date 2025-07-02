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
        {(post.content as string) || "No description provided."}
      </p>

      <PostTags tags={post.tags} />

      <Separator />

      <PostReactions post={post} currentUserClerkId={userId} />
    </div>
  );
};

export default PostContent;
