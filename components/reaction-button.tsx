"use client";

import { cn } from "@/lib/utils";
import React, { ButtonHTMLAttributes } from "react";

interface ReactionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  count?: number;
  isLoading?: boolean;
  activeColor?: string;
  showLabel?: boolean;
  label: string;
}

const ReactionButton = ({
  icon,
  count,
  isLoading = false,
  activeColor = "",
  showLabel = true,
  label,

  className = "",
  ...buttonProps
}: ReactionButtonProps) => (
  <button
    className={cn(`flex items-center cursor-pointer gap-1`, className)}
    disabled={isLoading || buttonProps.disabled}
    type="button"
    {...buttonProps}
  >
    <div className={!buttonProps.disabled ? activeColor : ""}>{icon}</div>
    <p className="text-muted-foreground">
      {count} {showLabel && <span className="hidden md:inline">{label}</span>}
    </p>
  </button>
);

export default ReactionButton;
