"use client";

import { useState } from "react";
import { User } from "@/sanity.types";
import { Input } from "@/components/ui/input";
import AdminUsersTable from "./admin-users-table";

type AdminUsersClientProps = {
  initialUsers: User[];
  user: User | null;
};

export default function AdminUsersClient({
  initialUsers,
  user,
}: AdminUsersClientProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <>
      <div className="flex items-center mb-4 gap-4 justify-between">
        <h1 className="text-2xl font-bold">Users</h1>

        <Input
          placeholder="Search users..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-[16rem]"
        />
      </div>
      <AdminUsersTable
        initialUsers={initialUsers}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        user={user}
      />
    </>
  );
}
