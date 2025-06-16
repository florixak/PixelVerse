"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PostTypesType, POST_TYPES } from "@/lib/constants";
import { Topic } from "@/sanity.types";

type BasicFieldsProps = {
  topics: Topic[];
  setPostType: (value: PostTypesType["value"]) => void;
  topicId?: string;
};

const BasicFields = ({ topics, setPostType, topicId }: BasicFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          required
          maxLength={100}
          placeholder="Enter a descriptive title"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Label htmlFor="topic">
          Topic <span className="text-red-500">*</span>
        </Label>
        <Select name="topic" required defaultValue={topicId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent>
            {topics.map((topic) => (
              <SelectItem key={topic._id} value={topic._id}>
                {topic.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" size="sm" asChild>
          <a href="/topics/new-topic">+</a>
        </Button>
      </div>

      <div>
        <Label htmlFor="postType">
          Post Type <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          defaultValue="text"
          name="postType"
          onValueChange={setPostType}
          className="flex flex-wrap gap-4 pt-2"
        >
          {POST_TYPES.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={type.value}
                id={`postType-${type.value}`}
              />
              <Label htmlFor={`postType-${type.value}`}>{type.title}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          rows={6}
          placeholder="Write your post content here..."
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="pixel, character, tutorial, etc."
        />
      </div>
    </div>
  );
};

export default BasicFields;
