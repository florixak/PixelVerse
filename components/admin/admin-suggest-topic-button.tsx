"use client";

import { Button } from "../ui/button";

interface AdminSuggestTopicButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  onClick: (topicId: string) => Promise<void>;
  variant?: "default" | "outline" | "ghost" | "destructive";
  topicId: string;
  children: React.ReactNode;
}

const AdminSuggestTopicButton = ({
  onClick,
  topicId,
  children,
  variant = "default",
  ...props
}: AdminSuggestTopicButtonProps) => {
  const handleClick = async () => {
    await onClick(topicId);
  };

  return (
    <Button onClick={handleClick} {...props} variant={variant}>
      {children}
    </Button>
  );
};
export default AdminSuggestTopicButton;
