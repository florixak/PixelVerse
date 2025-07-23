"use client";

import { useState } from "react";
import { Report } from "@/sanity.types";
import { Input } from "@/components/ui/input";
import UserReportsTable from "./user-reports-table";

type UserReportsClientProps = {
  initialReports: Report[];
};

export default function UserReportsClient({
  initialReports,
}: UserReportsClientProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center mb-4 gap-4 justify-between">
        <h1 className="text-2xl font-bold">My Reports</h1>

        <Input
          placeholder="Search reports..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-[16rem]"
        />
      </div>
      <UserReportsTable
        initialReports={initialReports}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </div>
  );
}
