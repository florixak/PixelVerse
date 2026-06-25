"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  className?: string;
  placeholder?: string;
  initialValue?: string;
  onSearch?: (value: string) => void;
};

const SearchBar = ({
  className,
  placeholder = "Search pixel art, topics, tags...",
  initialValue = "",
  onSearch,
}: SearchBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState(
    () => searchParams.get("q") ?? initialValue
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentQuery = searchParams.get("q") ?? "";
      if (searchValue === currentQuery) return;

      const params = new URLSearchParams(searchParams.toString());
      if (searchValue) {
        params.set("q", searchValue);
      } else {
        params.delete("q");
        params.delete("page");
      }

      const nextSearch = params.toString();
      router.replace(nextSearch ? `?${nextSearch}` : "/explore", {
        scroll: false,
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue, router, searchParams]);

  const clearSearch = () => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");
    const nextSearch = params.toString();
    router.replace(nextSearch ? `?${nextSearch}` : "/explore", { scroll: false });
    if (onSearch) onSearch("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={cn("relative w-[350px]", className)}>
      <div className="flex w-full items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 pr-10 w-full [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          />
          {searchValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
