"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type SubmitButtonProps = {
  label?: string;
  submittingLabel?: string;
  className?: string;
};

const SubmitButton = ({
  label = "Submit",
  submittingLabel = "Submitting...",
  className,
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <button
      type="submit"
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 self-end cursor-pointer",
        className
      )}
      disabled={isMounted ? pending : false}
    >
      {isMounted && pending ? submittingLabel : label}
    </button>
  );
};

export default SubmitButton;
