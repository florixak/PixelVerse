import { cn } from "@/lib/utils";
import { Post } from "@/sanity.types";

type PostTagsProps = {
  tags: Post["tags"];
  limit?: number;
  className?: string;
  tagClassName?: string;
};

const PostTags = ({ tags, limit, className, tagClassName }: PostTagsProps) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap mt-4 gap-1", className)}>
      {tags.slice(0, limit || tags.length).map((tag) => (
        <span
          key={tag}
          className={cn(
            "inline-block bg-muted text-foreground text-sm px-2 py-1 rounded-full border-2 border-muted",
            tagClassName
          )}
        >
          #{tag}
        </span>
      ))}
      {tags.length > (limit || tags.length) && (
        <span
          key={"more-tags"}
          className={cn(
            "inline-block bg-background text-foreground text-sm px-2 py-1 rounded-full border-2 border-muted",
            tagClassName
          )}
        >
          +{tags.length - (limit || tags.length)}
        </span>
      )}
    </div>
  );
};

export default PostTags;
