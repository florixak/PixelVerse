"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  className?: string;
  placeholder?: string;
  initialValue?: string;
  onSearch?: (value: string) => void;
  expanded?: boolean;
  autoFocus?: boolean;
};

const SearchBar = ({
  className,
  placeholder = "Search pixel art, topics, tags...",
  initialValue = "",
  onSearch,
  expanded = false,
  autoFocus = false,
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current && autoFocus) {
      inputRef.current.focus();
    }
  }, [isExpanded, autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchValue.trim() === "") {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (searchValue.trim()) {
      params.set("q", searchValue.trim());
    } else {
      params.delete("q");
    }

    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
    if (onSearch) {
      onSearch(searchValue);
    }

    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
    if (onSearch) onSearch("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="flex w-full items-center">
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
        <Button type="submit" size="sm" className="ml-2 px-3">
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
