"use client";

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { usePathname, useRouter } from "next/navigation";
import {
  BrushIcon,
  Clock,
  FlameIcon,
  HomeIcon,
  ImageIcon,
  MessageSquareIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  TagIcon,
  UsersIcon,
} from "lucide-react";
import { useTopics } from "@/hooks/use-topics";
import { toast } from "react-hot-toast";
import { useClerk, useUser } from "@clerk/nextjs";

const CommandSearch = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { popularTopics, isLoading } = useTopics(open);
  const { user } = useUser();
  const { openSignIn, openUserProfile } = useClerk();

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

  const handleCreatePost = () => {
    if (!user) {
      toast.error("You need to sign in to create a post");
      openSignIn();
      setOpen(false);
      return;
    }

    // If on a topic page, pre-select that topic for the new post
    if (pathname.startsWith("/topics/")) {
      const topicSlug = pathname.split("/").pop();
      router.push(`/create-post?topic=${topicSlug}`);
    } else {
      router.push("/create-post");
    }

    setOpen(false);
  };

  const navigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  // Common navigation commands available everywhere
  const commonCommands = (
    <>
      <CommandGroup heading="Navigation">
        <CommandItem
          onSelect={() => navigate("/")}
          className="flex items-center"
        >
          <HomeIcon className="mr-2 h-4 w-4" />
          Home
        </CommandItem>
        <CommandItem
          onSelect={() => navigate("/topics")}
          className="flex items-center"
        >
          <TagIcon className="mr-2 h-4 w-4" />
          Topics
        </CommandItem>
        <CommandItem
          onSelect={() => navigate("/explore")}
          className="flex items-center"
        >
          <SearchIcon className="mr-2 h-4 w-4" />
          Explore
        </CommandItem>
        {user && (
          <CommandItem
            onSelect={() => navigate(`/user/${user.username}`)}
            className="flex items-center"
          >
            <UsersIcon className="mr-2 h-4 w-4" />
            My Profile
          </CommandItem>
        )}
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup heading="Actions">
        <CommandItem onSelect={handleCreatePost} className="flex items-center">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Post
        </CommandItem>
        {user && (
          <CommandItem
            onSelect={() => openUserProfile()}
            className="flex items-center"
          >
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </CommandItem>
        )}
      </CommandGroup>
    </>
  );

  // Topic page specific commands
  if (pathname.startsWith("/topics/")) {
    const topicSlug = pathname.split("/").pop() || "";

    return (
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="This Topic">
            <CommandItem
              onSelect={() => navigate(`/topics/${topicSlug}?sort=latest`)}
              className="flex items-center"
            >
              <Clock className="mr-2 h-4 w-4" />
              Latest Posts
            </CommandItem>
            <CommandItem
              onSelect={() => navigate(`/topics/${topicSlug}?sort=trending`)}
              className="flex items-center"
            >
              <FlameIcon className="mr-2 h-4 w-4" />
              Trending Posts
            </CommandItem>
            <CommandItem
              onSelect={handleCreatePost}
              className="flex items-center"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              New Post in This Topic
            </CommandItem>
            <CommandItem
              onSelect={() => navigate(`/topics/${topicSlug}/artists`)}
              className="flex items-center"
            >
              <BrushIcon className="mr-2 h-4 w-4" />
              View Artists
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {commonCommands}
        </CommandList>
      </CommandDialog>
    );
  }

  // Topics index page
  if (pathname === "/topics") {
    return (
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {!isLoading && popularTopics && popularTopics.length > 0 && (
            <>
              <CommandGroup heading="Popular Topics">
                {popularTopics.slice(0, 5).map((topic) => (
                  <CommandItem
                    key={topic._id}
                    onSelect={() => navigate(`/topics/${topic.slug}`)}
                    className="flex items-center"
                  >
                    <TagIcon className="mr-2 h-4 w-4" />
                    {topic.title}
                  </CommandItem>
                ))}
                <CommandItem
                  onSelect={() => navigate("/topics?view=popular")}
                  className="flex items-center text-muted-foreground"
                >
                  <SearchIcon className="mr-2 h-4 w-4" />
                  View all popular topics...
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />
            </>
          )}

          <CommandGroup heading="Topic Actions">
            <CommandItem
              onSelect={() => navigate("/topics/suggest")}
              className="flex items-center"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Suggest New Topic
            </CommandItem>
            <CommandItem
              onSelect={() => navigate("/topics?view=recent")}
              className="flex items-center"
            >
              <Clock className="mr-2 h-4 w-4" />
              Recently Active Topics
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {commonCommands}
        </CommandList>
      </CommandDialog>
    );
  }

  // Profile page
  if (pathname.includes("/user/") || pathname.includes("/profile/")) {
    return (
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Profile Actions">
            <CommandItem
              onSelect={handleCreatePost}
              className="flex items-center"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Create New Post
            </CommandItem>
            <CommandItem
              onSelect={() => navigate(`${pathname}/posts`)}
              className="flex items-center"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              View All Posts
            </CommandItem>
            <CommandItem
              onSelect={() => navigate(`${pathname}/comments`)}
              className="flex items-center"
            >
              <MessageSquareIcon className="mr-2 h-4 w-4" />
              View All Comments
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {commonCommands}
        </CommandList>
      </CommandDialog>
    );
  }

  // Default command menu for other pages
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {!isLoading && popularTopics && popularTopics.length > 0 && (
          <>
            <CommandGroup heading="Quick Access">
              {popularTopics.slice(0, 3).map((topic) => (
                <CommandItem
                  key={topic._id}
                  onSelect={() => navigate(`/topics/${topic.slug}`)}
                  className="flex items-center"
                >
                  <TagIcon className="mr-2 h-4 w-4" />
                  {topic.title}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />
          </>
        )}

        {commonCommands}
      </CommandList>
    </CommandDialog>
  );
};

export default CommandSearch;
