import { cn, formatDate } from "@/lib/utils";
import { Post } from "@/sanity.types";
import Image from "next/image";
import Link from "next/link";

type PostAuthorProps = {
  author: Post["author"];
  publishedAt?: Post["publishedAt"];
  hideImage?: boolean;
  hideUsername?: boolean;
  hideFullName?: boolean;
  className?: string;
  imageClassName?: string;
};

const PostAuthor = ({
  author,
  publishedAt,
  hideImage = false,
  hideUsername = false,
  hideFullName = false,
  className,
  imageClassName,
}: PostAuthorProps) => {
  return (
    <div className={cn("flex flex-row gap-4 items-center", className)}>
      {!hideImage && (
        <Link href={`/profile/${author?.clerkId}`} className="hidden sm:block">
          <Image
            src={author?.imageUrl || "/avatar-default.svg"}
            alt={author?.username || "Author Image"}
            className={cn("w-12 h-12 rounded-full", imageClassName)}
            width={48}
            height={48}
            loading="lazy"
            placeholder="blur"
            blurDataURL={author?.imageUrl || "/avatar-default.svg"}
          />
        </Link>
      )}
      <div className="flex flex-col">
        {!hideFullName && (
          <h2 className="text-lg font-semibold">
            <Link
              href={`/profile/${author?.clerkId}`}
              className="hover:underline"
            >
              {author?.fullName || author?.username || "Unknown Author"}
            </Link>
          </h2>
        )}
        <div className="text-sm text-muted-foreground">
          {!hideUsername && <p>@{author?.username || "Unknown"}</p>}
          <p>{formatDate(publishedAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default PostAuthor;
