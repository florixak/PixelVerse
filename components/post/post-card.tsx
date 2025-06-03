import Card from "../card";
import { Post } from "@/sanity.types";
import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type PostCardProps = {
  post: Post;
  className?: string;
  imageSize?: "small" | "medium" | "large";
};

const PostCard = ({ post, className, imageSize }: PostCardProps) => {
  return (
    <Card className={cn("h-auto", className)}>
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
      <Link
        href={`/topics/${post.topicSlug + "/" + post.slug}`}
        className="block"
      >
        <h2 className="text-xl font-bold mt-2">{post.title}</h2>
      </Link>

      <p className="text-sm text-gray-600">{post.excerpt}</p>
      <p>
        <span className="font-semibold">Author:</span>{" "}
        <Link href={`/profile/${post.author?.clerkId}`}>
          {post.author?.username || "Unknown"}
        </Link>
      </p>
      <p>
        <span className="font-semibold">Published:</span>{" "}
        {formatDate(post.publishedAt)}
      </p>
      <p>
        <span className="font-semibold">Comments:</span>{" "}
        {post.comments?.length || 0}
      </p>
    </Card>
  );
};

export default PostCard;
