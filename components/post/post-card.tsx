import Card from "../card";
import { Post } from "@/sanity.types";
import { cn } from "@/lib/utils";

import Link from "next/link";
import PostAuthor from "./post-author";
import PostTags from "./post-tags";
import PostReactions from "./post-reactions";
import { Separator } from "../ui/separator";
import SmartImage from "../media/smart-image";

type PostCardProps = {
  post: Post;
  className?: string;
  imageSize?: "small" | "medium" | "large";
};

const PostCard = ({ post, className, imageSize }: PostCardProps) => {
  return (
    <Card className={cn("h-auto flex p-0 flex-col gap-2", className)}>
      {post.imageUrl && (
        <SmartImage
          src={post.imageUrl || "/avatar-default.svg"}
          width={
            imageSize === "large" ? 1200 : imageSize === "medium" ? 800 : 400
          }
          height={
            imageSize === "large" ? 600 : imageSize === "medium" ? 400 : 200
          }
          alt={post.title}
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
          <p className="text-sm text-muted-foreground ml-1">{post.excerpt}</p>

          <PostTags tags={post.tags} limit={3} className="mt-0" />
        </div>

        <Separator />

        <PostReactions
          post={post}
          collapsed
          className="mt-2 scale-90"
          commentsLink={
            "/topics/" + post.topicSlug + "/" + post.slug + "#comments"
          }
        />
      </div>
    </Card>
  );
};

export default PostCard;
