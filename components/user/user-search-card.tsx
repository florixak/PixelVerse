import { User } from "@/sanity.types";

type UserSearchCardProps = {
  user: User;
};

const UserSearchCard = ({ user }: UserSearchCardProps) => {
  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors">
      <img
        src={user.imageUrl || "/avatar-default.svg"}
        alt={user.fullName || user.username || "User Avatar"}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex flex-col">
        <p className="font-semibold">{user.fullName || user.username}</p>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
      </div>
    </div>
  );
};

export default UserSearchCard;
