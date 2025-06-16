import { cn, formatDate } from "@/lib/utils";
import { Post } from "@/sanity.types";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import Role from "../role";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
  const userProfile = author?.username
    ? `/user/${author?.username}`
    : `/profile/${author?.clerkId}`;
  return (
    <div className={cn("flex flex-row gap-2 items-center", className)}>
      {!hideImage && (
        <Link href={userProfile} className="hidden sm:block">
          <Avatar>
            <AvatarImage
              src={author?.imageUrl || "/avatar-default.svg"}
              alt={author?.fullName || author?.username || "User Avatar"}
              className="rounded-full cursor-pointer"
            />
            <AvatarFallback>
              {author?.fullName?.charAt(0) ||
                author?.username?.charAt(0) ||
                "U"}
            </AvatarFallback>
          </Avatar>
        </Link>
      )}
      <div className="flex flex-col">
        {!hideFullName && (
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Link href={userProfile} className="hover:underline">
              {author?.fullName || author?.username || "Unknown Author"}
            </Link>
            <Role role={author?.role} />
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
