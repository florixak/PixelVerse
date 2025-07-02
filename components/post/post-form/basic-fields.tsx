"use client";

import TopicSuggestButton from "@/components/topic/topic-suggest-button";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { POST_TYPES } from "@/constants";
import { Post, Topic } from "@/sanity.types";

type BasicFieldsProps = {
  topics: Topic[];
  setPostType: (value: Post["postType"]) => void;
  topicId?: string;
  post?: Post | null;
  postType?: Post["postType"];
  disabledComments?: boolean;
  setDisabledComments?: (value: boolean) => void;
};

const BasicFields = ({
  topics,
  setPostType,
  topicId,
  post,
  postType = "text",
  disabledComments = false,
  setDisabledComments = () => {},
}: BasicFieldsProps) => {
  const defaultTitle = post?.title || "";
  const defaultContent = (post?.content || "") as string;
  const defaultTags = post?.tags?.join(", ") || "";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          required
          maxLength={100}
          placeholder="Enter a descriptive title"
          defaultValue={defaultTitle}
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
        <TopicSuggestButton />
      </div>

      <div className="space-y-2">
        <Label htmlFor="postType">
          Post Type <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          defaultValue={postType}
          name="postType"
          onValueChange={(value) => setPostType(value as Post["postType"])}
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

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          rows={6}
          placeholder="Write your post content here..."
          defaultValue={defaultContent}
        />
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="disabledComments">Disable Comments</Label>
        <Switch
          id="disabledComments"
          name="disabledComments"
          defaultChecked={disabledComments}
          onCheckedChange={(checked) => setDisabledComments(checked as boolean)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="pixel, character, tutorial, etc."
          defaultValue={defaultTags}
        />
      </div>
    </div>
  );
};

export default BasicFields;
