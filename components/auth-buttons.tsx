"use client";

import { SignedOut, SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const AuthButtons = () => {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading
        </Button>
      </div>
    );
  }

  return (
    <SignedOut>
      <div className="flex items-center space-x-2">
        <SignInButton mode="modal">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="default" size="sm">
            Sign Up
          </Button>
        </SignUpButton>
      </div>
    </SignedOut>
  );
};

export default AuthButtons;
