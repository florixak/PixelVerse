import React from "react";
import { Label } from "../ui/label";
import {
  SOFTWARE_OPTIONS,
  DIFFICULTY_LEVELS,
  PostTypesType,
  SoftwareOptionType,
} from "@/lib/constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

type ConditionalFieldsProps = {
  postType: PostTypesType["value"];
  isOriginal: boolean;
  setIsOriginal: (value: boolean) => void;
  software: SoftwareOptionType["value"][];
  handleSoftwareChange: (value: SoftwareOptionType["value"]) => void;
  colorPalette: { hex: string; name: string }[];
  updateColorPalette: (
    index: number,
    field: "hex" | "name",
    value: string
  ) => void;
  addColorTopalette: () => void;
};

const ConditionalFields = ({
  postType,
  isOriginal,
  setIsOriginal,
  software,
  handleSoftwareChange,
  colorPalette,
  updateColorPalette,
  addColorTopalette,
}: ConditionalFieldsProps) => {
  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h2 className="text-xl font-semibold">
        {postType === "pixelArt" ? "Pixel Art" : "Animation"} Details
      </h2>

      <div>
        <Label htmlFor="image">Upload Image</Label>
        <Input id="image" name="image" type="file" accept="image/*" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="width">Width (pixels)</Label>
          <Input id="width" name="dimensions.width" type="number" min="1" />
        </div>
        <div>
          <Label htmlFor="height">Height (pixels)</Label>
          <Input id="height" name="dimensions.height" type="number" min="1" />
        </div>
      </div>

      <div>
        <Label>Software Used</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {SOFTWARE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`software-${option.value}`}
                checked={software.includes(option.value)}
                onChange={() => handleSoftwareChange(option.value)}
                className="rounded"
              />
              <Label htmlFor={`software-${option.value}`}>{option.title}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Color Palette</Label>
        {colorPalette.map((color, index) => (
          <div key={index} className="flex space-x-2 mt-2">
            <Input
              type="color"
              value={color.hex}
              onChange={(e) => updateColorPalette(index, "hex", e.target.value)}
              className="w-20"
            />
            <Input
              placeholder="Color name"
              value={color.name}
              onChange={(e) =>
                updateColorPalette(index, "name", e.target.value)
              }
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addColorTopalette}
          className="mt-2"
        >
          Add Color
        </Button>
      </div>

      <div>
        <Label htmlFor="difficulty">Difficulty Level</Label>
        <Select name="difficulty">
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTY_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="timeSpent">Time Spent (hours)</Label>
        <Input
          id="timeSpent"
          name="timeSpent"
          type="number"
          min="0"
          step="0.5"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isOriginal"
          name="isOriginal"
          checked={isOriginal}
          onCheckedChange={setIsOriginal}
        />
        <Label htmlFor="isOriginal">This is an original creation</Label>
      </div>

      {!isOriginal && (
        <div>
          <Label htmlFor="inspirationSource">Inspiration Source</Label>
          <Input
            id="inspirationSource"
            name="inspirationSource"
            placeholder="Credit the original creator or source"
          />
        </div>
      )}
    </div>
  );
};

export default ConditionalFields;
