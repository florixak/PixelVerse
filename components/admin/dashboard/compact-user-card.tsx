import { User } from "@/sanity.types";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, Ban } from "lucide-react";
import { formatDate } from "@/lib/utils";

type CompactUserCardProps = {
  user: User;
};

const CompactUserCard = ({ user }: CompactUserCardProps) => {
  const userStatus = () => {
    if (user.isBanned) {
      return {
        icon: <Ban className="h-3.5 w-3.5 text-red-500" />,
        label: "Banned",
      };
    }

    /*if (user.emailVerified) {
      return {
        icon: <CheckCircle className="h-3.5 w-3.5 text-green-500" />,
        label: "Verified",
      };
    }*/

    return {
      icon: <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />,
      label: "Pending",
    };
  };

  const { icon, label } = userStatus();
  const createdAt = formatDate(user.createdAt);

  return (
    <Link
      href={`/admin/users/${user.clerkId}`}
      className="block border rounded-md hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center p-2.5">
        {/* Avatar */}
        <Avatar className="h-8 w-8 mr-3">
          <AvatarImage src={user.imageUrl} alt={user.username || "User"} />
          <AvatarFallback>
            {user.username?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* User info */}
        <div className="min-w-0 flex-1">
          <div className="flex justify-between">
            <p className="text-xs font-medium truncate">
              {user.username || "Anonymous User"}
            </p>
            <p className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
              {createdAt}
            </p>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="truncate mr-1.5">{user.email || "No email"}</span>
            <div className="flex items-center" title={label}>
              {icon}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompactUserCard;
