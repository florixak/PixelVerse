"use client";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";
import { MoreVertical } from "lucide-react";

type ThreeDotsSelectProps = {
  options: {
    label: string;
    value: string;
    onSelect: () => void;
  }[];
};

const ThreeDotsSelect = ({ options }: ThreeDotsSelectProps) => {
  if (options.length === 0) {
    <Select>
      <SelectTrigger className="w-10 h-10" asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <MoreVertical className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="no-options" disabled>
          No options available
        </SelectItem>
      </SelectContent>
    </Select>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-10 h-10" asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <MoreVertical className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" alignOffset={-100}>
        {options.length === 0 ? (
          <DropdownMenuItem disabled>No options available</DropdownMenuItem>
        ) : (
          options.map((option) => (
            <DropdownMenuItem key={option.value} onClick={option.onSelect}>
              {option.label}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThreeDotsSelect;
