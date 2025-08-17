import { User } from "@/sanity.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

type UserSearchCardProps = {
  user: User;
  className?: string;
  onClick?: () => void;
  showBadge?: boolean;
  size?: "sm" | "md" | "lg";
};

const UserSearchCard = ({
  user,
  className,
  onClick,
  showBadge = false,
  size = "md",
}: UserSearchCardProps) => {
  if (!user) {
    return null;
  }

  const sizeClasses = {
    sm: {
      container: "gap-2 p-2",
      avatar: "w-8 h-8",
      name: "text-sm",
      username: "text-xs",
    },
    md: {
      container: "gap-3 p-3",
      avatar: "w-10 h-10",
      name: "text-base",
      username: "text-sm",
    },
    lg: {
      container: "gap-4 p-4",
      avatar: "w-12 h-12",
      name: "text-lg",
      username: "text-base",
    },
  };

  const currentSize = sizeClasses[size];

  const getInitials = (name?: string, username?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (username) {
      return username.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const displayName = user.fullName || user.username || "Unknown User";
  const initials = getInitials(user.fullName, user.username);

  return (
    <Link href={`/user/${user.username}`} passHref>
      <div
        className={cn(
          "flex items-center rounded-lg transition-all duration-200 cursor-pointer w-xs",
          "hover:bg-gray-50 dark:hover:bg-gray-800/50",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
          onClick && "hover:shadow-sm",
          user.isBanned && "opacity-50 cursor-not-allowed",
          currentSize.container,
          className
        )}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        <div className="relative flex-shrink-0">
          <Avatar className={currentSize.avatar}>
            <AvatarImage src={user.imageUrl} alt={`${displayName}'s avatar`} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {showBadge && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
          )}

          {user.isBanned && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={cn(
                "font-semibold text-gray-900 dark:text-gray-100 truncate",
                currentSize.name
              )}
            >
              {displayName}
            </p>
          </div>

          {user.username && (
            <p
              className={cn(
                "text-gray-500 dark:text-gray-400 truncate",
                currentSize.username
              )}
            >
              @{user.username}
            </p>
          )}

          {user.bio && size === "lg" && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
              {user.bio}
            </p>
          )}

          {size === "lg" && (
            <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              {user.postCount !== undefined && (
                <span>{user.postCount} posts</span>
              )}
            </div>
          )}
        </div>

        {onClick && (
          <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        )}
      </div>
    </Link>
  );
};

export default UserSearchCard;
