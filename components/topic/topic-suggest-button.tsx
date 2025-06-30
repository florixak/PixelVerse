"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const TopicSuggestButton = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/topics/suggest");
  };
  return (
    <Button type="button" variant="outline" onClick={handleClick}>
      Suggest a Topic
    </Button>
  );
};

export default TopicSuggestButton;
