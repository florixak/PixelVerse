import Image from "next/image";
import { Notification as NotificationType } from "@/sanity.types";
import Link from "next/link";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useRouter } from "next/navigation";

type NotificationProps = {
  notification: NotificationType;
  onClick?: (notification: NotificationType) => void;
};

const Notification = ({ notification, onClick }: NotificationProps) => {
  const router = useRouter();
  const { sender, type, content, isRead, createdAt, message } = notification;

  const getNavigationUrl = () => {
    switch (type) {
      case "follow":
        return `/user/${sender?.username}`;
      case "post_like":
      case "comment":
      case "comment_like":
        if (
          content &&
          content?._type === "post" &&
          content.topicSlug &&
          content.slug
        ) {
          return `/topics/${content.topicSlug}/${content.slug}`;
        }
        if (
          content &&
          content?._type === "comment" &&
          content.post?.topicSlug &&
          content.post?.slug
        ) {
          return `/topics/${content.post?.topicSlug}/${content.post?.slug}#comment-${content._id}`;
        }
        return `/user/${sender?.username}`;
      default:
        return `/user/${sender?.username}`;
    }
  };
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(notification);
    }

    const url = getNavigationUrl();
    router.push(url);
  };

  return (
    <div
      key={notification._id}
      className={`p-3 rounded-lg mb-2 cursor-pointer hover:bg-muted/50 transition-colors ${
        !notification.isRead ? "bg-muted border-l-2 border-blue-500" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <Image
          src={sender?.imageUrl || "/avatar-default.svg"}
          alt={sender?.username || "User"}
          width={32}
          height={32}
          className="rounded-full flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="text-sm">
            <span className="font-medium text-foreground">
              {sender?.username}
            </span>
            <span className="text-muted-foreground"> {message}</span>

            {content && <ContentLink content={content} />}
          </div>

          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>

        {!isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
      </div>
    </div>
  );
};

const ContentLink = ({ content }: { content: NotificationType["content"] }) => {
  if (!content) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (content._type === "post" && content.topicSlug && content.slug) {
    return (
      <Link
        href={`/topics/${content.topicSlug}/${content.slug}`}
        className="font-medium text-primary hover:underline ml-1"
        onClick={handleClick}
      >
        "{content.title}"
      </Link>
    );
  }

  if (
    content._type === "comment" &&
    content.post?.topicSlug &&
    content.post?.slug
  ) {
    return (
      <Link
        href={`/topics/${content.post.topicSlug}/${content.post.slug}#comment-${content._id}`}
        className="font-medium text-primary hover:underline ml-1"
        onClick={handleClick}
      >
        "{content.post.title}"
      </Link>
    );
  }

  return null;
};

export default Notification;
