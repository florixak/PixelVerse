"use client";

import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type TopicSearchProps = {
  order?: string;
};

const TopicSearch = ({ order }: TopicSearchProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <Input
        type="search"
        placeholder="Search topics..."
        className="w-full max-w-lg"
        aria-label="Search topics"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        inputMode="search"
      />
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent defaultValue={order || "latest"}>
          <SelectItem value="latest">Latest</SelectItem>
          <SelectItem value="alphabetical">Alphabetical</SelectItem>
          <SelectItem value="popular">Popular</SelectItem>
          <SelectItem value="trending">Trending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TopicSearch;
