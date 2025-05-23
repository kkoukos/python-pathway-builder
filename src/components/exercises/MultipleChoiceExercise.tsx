
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  text: string;
}

interface MultipleChoiceExerciseProps {
  options: Option[];
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
  isDisabled?: boolean;
  correctOption?: string;
  exerciseId?: number; // Add exerciseId to ensure uniqueness
}

const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  options,
  selectedOption,
  onSelectOption,
  isDisabled = false,
  correctOption,
  exerciseId = 0, // Default to 0 if not provided
}) => {
  // Create a unique radio group name using the exerciseId
  // This ensures each exercise has its own radio group
  const radioGroupName = `exercise-${exerciseId}`;

  return (
    <RadioGroup
      className="space-y-3"
      value={selectedOption || ""}
      onValueChange={onSelectOption}
      disabled={isDisabled}
      name={radioGroupName}
    >
      {options.map((option) => {
        const isCorrect = correctOption === option.id;
        const isSelected = selectedOption === option.id;
        const showIncorrect = correctOption && isSelected && !isCorrect;
        
        return (
          <div
            key={`${radioGroupName}-${option.id}`}
            className={cn(
              "flex items-center space-x-3 rounded-md border p-4 transition-colors",
              isDisabled ? "opacity-70" : "hover:bg-accent/50",
              isCorrect && correctOption ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "",
              showIncorrect ? "border-red-500 bg-red-50 dark:bg-red-950/30" : ""
            )}
          >
            <RadioGroupItem
              value={option.id}
              id={`option-${exerciseId}-${option.id}`}
              className="h-5 w-5"
            />
            <Label
              htmlFor={`option-${exerciseId}-${option.id}`}
              className="flex-1 cursor-pointer text-base leading-relaxed"
            >
              {option.text}
            </Label>
            {correctOption && isCorrect && (
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            )}
            {showIncorrect && (
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
            )}
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default MultipleChoiceExercise;
