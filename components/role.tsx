import { User } from "@/sanity.types";
import { Badge } from "./ui/badge";

type RoleProps = {
  role: User["role"];
};

const Role = ({ role }: RoleProps) => {
  if (!role) {
    return null;
  }
  return (
    <Badge
      className={
        "text-xs font-semibold px-2 py-1 rounded-md bg-gray-200 text-gray-800"
      }
    >
      {role === "admin" && "Admin"}
      {role === "moderator" && "Mod"}
    </Badge>
  );
};

export default Role;
