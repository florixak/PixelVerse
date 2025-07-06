import { Button } from "@/components/ui/button";
import SortFilterSelect from "@/components/sort-filter-select";
import { Topic } from "@/sanity.types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import AuthButtons from "../auth-buttons";
import NotSignInButton from "../not-sign-in-button";

type TopicActionsProps = {
  topic: Topic;
};

const TopicActions = async ({ topic }: TopicActionsProps) => {
  if (!topic || !topic.slug) return null;
  const user = await currentUser();

  return (
    <div className="max-w-xs w-full flex items-center justify-center sm:justify-start gap-2 mt-4">
      {user ? (
        <Button variant="outline" asChild disabled={!user}>
          (
          <Link
            href={`/create-post?topic=${encodeURIComponent(topic.slug)}`}
            className="flex items-center gap-2"
            aria-label="Create new post"
          >
            <span>Create New Post</span>
            <Plus />
          </Link>
          )
        </Button>
      ) : (
        <NotSignInButton text="Sign in to create a post" />
      )}
      <SortFilterSelect />
    </div>
  );
};

export default TopicActions;
