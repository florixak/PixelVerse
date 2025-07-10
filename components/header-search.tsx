"use client";

import React, { useState } from "react";
import CommandSearch from "./command-search";
import { Badge } from "./ui/badge";
import { SearchIcon } from "lucide-react";

const HeaderSearch = () => {
  const [commandOpen, setCommandOpen] = useState<boolean>(false);

  return (
    <>
      <div className="relative w-full max-w-2xs md:max-w-xs">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <SearchIcon
            className="w-4 h-4 cursor-pointer"
            onClick={() => setCommandOpen(true)}
          />
        </span>
        <input
          type="search"
          placeholder="Search or jump to..."
          onFocus={() => setCommandOpen(true)}
          onClick={() => setCommandOpen(true)}
          readOnly
          className="pl-10 pr-20 py-2 rounded-md border w-full"
        />
        <Badge
          variant="secondary"
          className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer flex gap-1"
          onClick={() => setCommandOpen(true)}
        >
          <kbd className="kbd">⌘</kbd>
          <kbd className="kbd">K</kbd>
        </Badge>
      </div>

      <CommandSearch open={commandOpen} setOpen={setCommandOpen} />
    </>
  );
};

export default HeaderSearch;
