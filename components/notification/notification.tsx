import Image from "next/image";
import { Notification as NotificationType } from "@/sanity.types";
import Link from "next/link";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { on } from "events";

type NotificationProps = {
  notification: NotificationType;
  onClick?: (notification: NotificationType) => void;
};

const Notification = ({ notification, onClick }: NotificationProps) => {
  const { sender, type, isRead } = notification;
  console.log("Notification:", notification);
  return (
    <div
      key={notification._id}
      className={`p-3 rounded-lg mb-2 cursor-pointer hover:bg-muted/50 ${
        !notification.isRead ? "bg-muted border-l-2 border-blue-500" : ""
      }`}
      onClick={() => {
        if (onClick) {
          onClick(notification);
        }
      }}
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
          <p className="text-sm">
            <Link
              href={`/user/${sender?.username}`}
              className="font-medium hover:underline"
            >
              {sender?.username}
            </Link>{" "}
            {type === "follow" && "started following you"}
            {type === "post_like" && "liked your post"}
            {type === "comment" && "commented on your post"}
          </p>

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

export default Notification;
