import { getRecentUsers } from "@/sanity/lib/dashboard";
import CompactUserCard from "./compact-user-card";

const NewUsers = async () => {
  const newUsers = await getRecentUsers(6);

  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium mb-2">New Users</h3>
      <div className="space-y-1.5">
        {newUsers.map((user) => (
          <CompactUserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default NewUsers;
