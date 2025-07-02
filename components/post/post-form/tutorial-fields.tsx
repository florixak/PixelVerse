import { Label } from "@/components/ui/label";
import { TutorialStepType } from "./create-post-form";
import { DIFFICULTY_LEVELS } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TutorialFieldsProps = {
  tutorialSteps: Array<TutorialStepType>;
  addTutorialStep: () => void;
  updateTutorialStep: (
    index: number,
    field: keyof TutorialStepType,
    value: string
  ) => void;
};

const TutorialFields = ({
  tutorialSteps,
  addTutorialStep,
  updateTutorialStep,
}: TutorialFieldsProps) => {
  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h2 className="text-xl font-semibold">Tutorial Steps</h2>

      {tutorialSteps.map((step, index) => (
        <div key={index} className="space-y-2 p-3 border rounded-md">
          <h3 className="font-medium">Step {index + 1}</h3>
          <div>
            <Label htmlFor={`step-${index}-title`}>Title</Label>
            <Input
              id={`step-${index}-title`}
              value={step.title}
              onChange={(e) =>
                updateTutorialStep(index, "title", e.target.value)
              }
              placeholder="Step title"
            />
          </div>
          <div>
            <Label htmlFor={`step-${index}-description`}>Description</Label>
            <Textarea
              id={`step-${index}-description`}
              value={step.description}
              onChange={(e) =>
                updateTutorialStep(index, "description", e.target.value)
              }
              placeholder="Explain this step..."
            />
          </div>
          <div>
            <Label htmlFor={`step-${index}-image`}>Image URL</Label>
            <Input
              id={`step-${index}-image`}
              value={step.imageUrl}
              onChange={(e) =>
                updateTutorialStep(index, "imageUrl", e.target.value)
              }
              placeholder="URL to step image"
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addTutorialStep}>
        Add Step
      </Button>

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
    </div>
  );
};

export default TutorialFields;
