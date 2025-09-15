"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useClerk } from "@clerk/nextjs";

const TopicSuggestButton = () => {
  const { isSignedIn, openSignIn } = useClerk();
  const router = useRouter();
  const handleClick = () => {
    if (isSignedIn) {
      router.push("/topics/suggest");
    } else {
      openSignIn();
    }
  };
  return (
    <Button type="button" variant="outline" onClick={handleClick}>
      Suggest a Topic
    </Button>
  );
};

export default TopicSuggestButton;
