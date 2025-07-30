"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import toast from "react-hot-toast";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
};

const TagInput = ({
  value,
  onChange,
  placeholder = "Add a tag",
  maxTags = 10,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  const addTag = (tag: string) => {
    if (maxTags && value.length >= maxTags) {
      toast.error(`Maximum of ${maxTags} tags reached.`);
      return;
    }
    const newTag = tag.trim();
    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag]);
    }
  };

  const removeTag = (index: number) => {
    if (value.length === 0) return;
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      addTag(inputValue);
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      e.preventDefault();
      removeTag(value.length - 1);
    }
  };

  const handleBlur = () => {
    if (inputValue) {
      addTag(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border rounded-xl p-2 py-1 focus-within:ring-2 ring-ring transition">
      {value.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1 text-sm rounded-lg"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="ml-1 text-muted-foreground hover:text-destructive transition-colors focus:outline-none cursor-pointer"
            aria-label={`Remove ${tag} tag`}
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        aria-label="Add a tag"
        className="border-none focus-visible:ring-0 shadow-none w-auto flex-1 min-w-[100px]"
      />
    </div>
  );
};

export default TagInput;
