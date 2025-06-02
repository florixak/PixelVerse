"use client";

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const CommandSearch = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (pathname === "/topics") {
    return (
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Posts">
            <CommandItem>Create new post</CommandItem>
            <CommandItem>View the latest posts</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    );
  }

  if (pathname.startsWith("/topics/")) {
    const topicSlug = pathname.replace("/topics", "");
    return (
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Posts">
            <CommandItem>
              <Link href={`/topics/${topicSlug}/new-post`}>
                Create new post
              </Link>
            </CommandItem>
            <CommandItem>
              <Link href={`/topics/${topicSlug}?order=latest`}>
                View the latest posts
              </Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    );
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Topics">
          <CommandItem>View All Topics</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Posts">
          <CommandItem>
            <Link href={""}>Create new post</Link>
          </CommandItem>
          <CommandItem>View the latest posts</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandSearch;
