"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

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

  return (
    <Button
      type="submit"
      variant="default"
      className={cn("self-end px-4 py-2 rounded-lg", className)}
      disabled={pending}
    >
      {pending ? submittingLabel : label}
    </Button>
  );
};

export default SubmitButton;
