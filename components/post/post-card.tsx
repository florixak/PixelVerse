import Card from "../card";
import { Post } from "@/sanity.types";
import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import PostAuthor from "./post-author";
import PostTags from "./post-tags";
import PostReactions from "./post-reactions";
import { Separator } from "../ui/separator";

type PostCardProps = {
  post: Post;
  className?: string;
  imageSize?: "small" | "medium" | "large";
};

const PostCard = ({ post, className, imageSize }: PostCardProps) => {
  return (
    <Card className={cn("h-auto flex p-0 flex-col gap-2", className)}>
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title || "Post Image"}
          className="object-cover rounded-lg w-full"
          width={
            imageSize === "small" ? 150 : imageSize === "medium" ? 300 : 600
          }
          height={
            imageSize === "small" ? 150 : imageSize === "medium" ? 300 : 600
          }
          loading="lazy"
          placeholder="blur"
          blurDataURL={post.imageUrl}
        />
      )}
      <div className="flex flex-col p-4 gap-1">
        <div className="flex flex-col">
          <PostAuthor
            author={post.author}
            publishedAt={post.publishedAt}
            hideUsername
            imageClassName="w-9 h-9"
          />
          <Link
            href={`/topics/${post.topicSlug + "/" + post.slug}`}
            className="block"
          >
            <h2 className="text-2xl font-bold mt-2">{post.title}</h2>
          </Link>
        </div>
        <div className="flex flex-col gap-2 mb-2">
          <p className="text-sm text-gray-600 ml-1">{post.excerpt}</p>

          <PostTags tags={post.tags} limit={3} className="mt-0" />
        </div>

        <Separator />

        <PostReactions
          postId={post._id}
          reactions={post.reactions || []}
          collapsed
          className="mx-3 mt-2"
          commentsCount={post.commentsCount || 0}
          commentsLink={
            "/topics/" + post.topicSlug + "/" + post.slug + "#comments"
          }
        />
      </div>
    </Card>
  );
};

export default PostCard;
