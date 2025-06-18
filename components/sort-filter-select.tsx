"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useRouter } from "next/navigation";
import { SortOrder } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortFilterSelectProps = {
  defaultValue?: SortOrder;
  className?: string;
  placeholder?: string;
};

const SortFilterSelect = ({
  defaultValue = "latest",
  className = "",
  placeholder = "Sort by",
}: SortFilterSelectProps) => {
  const router = useRouter();

  const handleSortChange = (value: SortOrder) => {
    if (!value) return;
    const url = new URL(window.location.href);
    url.searchParams.set("sort", value);
    router.push(url.toString());
  };

  return (
    <Select onValueChange={handleSortChange} defaultValue={defaultValue}>
      <SelectTrigger className={cn("w-48", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="latest">Latest</SelectItem>
        <SelectItem value="oldest">Oldest</SelectItem>
        <SelectItem value="alphabetical">Alphabetical</SelectItem>
        <SelectItem value="popular">Popular</SelectItem>
        <SelectItem value="trending">Trending</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SortFilterSelect;
