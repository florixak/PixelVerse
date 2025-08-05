"use client";

import { useState } from "react";
import { SuggestedTopic, User } from "@/sanity.types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminSuggestedTopicsTable from "./admin-suggested-topics-table";

type AdminSuggestedTopicsClientProps = {
  initialTopics: SuggestedTopic[];
  user: User | null;
};

export default function AdminSuggestedTopicsClient({
  initialTopics,
  user,
}: AdminSuggestedTopicsClientProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTopics = initialTopics.filter((topic) => {
    if (statusFilter === "all") return true;
    return topic.status === statusFilter;
  });

  return (
    <>
      <div className="flex items-center mb-4 gap-4 justify-between">
        <h1 className="text-2xl font-bold">Suggested Topics</h1>

        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending_ai">⏳ Pending AI</SelectItem>
              <SelectItem value="ai_approved">✅ AI Approved</SelectItem>
              <SelectItem value="ai_rejected">❌ AI Rejected</SelectItem>
              <SelectItem value="needs_human_review">
                👁️ Needs Review
              </SelectItem>
              <SelectItem value="manually_approved">
                ✅ Manually Approved
              </SelectItem>
              <SelectItem value="rejected">🚫 Rejected</SelectItem>
              <SelectItem value="published">🚀 Published</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Search topics..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-[16rem]"
          />
        </div>
      </div>

      <AdminSuggestedTopicsTable
        initialTopics={filteredTopics}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        user={user}
      />
    </>
  );
}
