"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  className?: string;
};

const BackButton = ({ className }: BackButtonProps) => {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className={className}
    >
      <ArrowLeft /> Back
    </Button>
  );
};

export default BackButton;
