"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

const JoinCommunity = () => {
  return (
    <section className="w-full py-16 text-center bg-muted/30">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Join Our Community
      </h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        Connect with thousands of pixel artists, get feedback on your work, and
        participate in weekly challenges.
      </p>
      <SignInButton mode="modal">
        <Button size="lg">Get Started</Button>
      </SignInButton>
    </section>
  );
};

export default JoinCommunity;
