"use client";
import { useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type NotSignInButtonProps = {
  text?: string;
  className?: string;
};

const NotSignInButton = ({ text, className }: NotSignInButtonProps) => {
  const { openSignIn } = useClerk();
  return (
    <Button
      variant="outline"
      onClick={() => openSignIn()}
      className={className}
      aria-label="Sign in to create a post"
    >
      {text}
    </Button>
  );
};

export default NotSignInButton;
