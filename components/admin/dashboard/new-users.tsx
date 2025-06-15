import { getRecentUsers } from "@/sanity/lib/dashboard";
import CompactUserCard from "./compact-user-card";

const NewUsers = async () => {
  const newUsers = await getRecentUsers(6);

  return (
    <div className="space-y-1.5">
      {newUsers.map((user) => (
        <CompactUserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

export default NewUsers;
