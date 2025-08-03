import Image from "next/image";
import { Notification as NotificationType } from "@/sanity.types";
import Link from "next/link";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useRouter } from "next/navigation";

type NotificationProps = {
  notification: NotificationType;
  onClick?: (notification: NotificationType) => void;
};

type NotificationMessageProps = {
  notification: NotificationType;
  handleLinkClick?: (e: React.MouseEvent) => void;
};

const Notification = ({ notification, onClick }: NotificationProps) => {
  const router = useRouter();
  const { sender, type, content, isRead } = notification;
  const getNavigationUrl = () => {
    switch (type) {
      case "follow":
        return `/user/${sender?.username}`;
      case "post_like":
      case "comment":
      case "comment_like":
        if (content && content?._type === "post") {
          return `/topics/${content.topicSlug || content._id}/${content.slug}`;
        } else if (content && content?._type === "comment") {
          return `/topics/${content.post?.topicSlug || content.post?._id}/${
            content.post?.slug
          }#comment-${content._id}`;
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

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      key={notification._id}
      className={`p-3 rounded-lg mb-2 cursor-pointer hover:bg-muted/50 ${
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
          className="rounded-full"
        />

        <div className="flex-1 min-w-0">
          <NotificationMessage
            notification={notification}
            handleLinkClick={handleLinkClick}
          />

          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>

        {!isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
      </div>
    </div>
  );
};

const NotificationMessage = ({
  notification,
  handleLinkClick,
}: NotificationMessageProps) => {
  const { sender, type, content, message } = notification;
  return (
    <p className="text-sm">
      <span onClick={handleLinkClick} className="font-medium">
        {sender?.username}
      </span>{" "}
      {message}
      {content && content._type === "post" && (
        <Link
          href={`/topics/${content.topicSlug || content._id}`}
          className="font-medium"
          onClick={handleLinkClick}
        >
          {content.title}
        </Link>
      )}
      {content && content._type === "comment" && (
        <Link
          href={`/topics/${content.post?.topicSlug || content.post?._id}/${
            content.post?.slug
          }#comment-${content._id}`}
          className="font-medium"
          onClick={handleLinkClick}
        >
          {content.post?.title}
        </Link>
      )}
      {content && content._type === "user" && (
        <Link
          href={`/user/${content.username}`}
          className="font-medium"
          onClick={handleLinkClick}
        >
          {content.username}
        </Link>
      )}
      {type === "follow" && <span className="font-medium">followed you</span>}
    </p>
  );
};

export default Notification;
