"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";

type NotSignInButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

const NotSignInButton = ({ children, className }: NotSignInButtonProps) => {
  const { openSignIn } = useClerk();
  return (
    <Button
      variant="outline"
      onClick={() => openSignIn()}
      className={className}
      aria-label="Sign in to create a post"
    >
      {children}
    </Button>
  );
};

export default NotSignInButton;
