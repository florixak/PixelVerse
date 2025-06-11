"use client";

import { useState } from "react";
import { Report, User } from "@/sanity.types";
import { Input } from "@/components/ui/input";
import AdminReportsTable from "./admin-reports-table";

type AdminReportsClientProps = {
  initialReports: Report[];
  user: User | null;
};

export default function AdminReportsClient({
  initialReports,
  user,
}: AdminReportsClientProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <>
      <div className="flex items-center mb-4 gap-4 justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>

        <Input
          placeholder="Search reports..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-[16rem]"
        />
      </div>
      <AdminReportsTable
        initialReports={initialReports}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        currentUser={user}
      />
    </>
  );
}
