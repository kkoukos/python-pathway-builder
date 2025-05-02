
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

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
}

const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  options,
  selectedOption,
  onSelectOption,
  isDisabled = false,
  correctOption,
}) => {
  return (
    <RadioGroup
      className="space-y-3"
      value={selectedOption || ""}
      onValueChange={onSelectOption}
      disabled={isDisabled}
    >
      {options.map((option) => {
        const isCorrect = correctOption === option.id;
        const isSelected = selectedOption === option.id;
        
        return (
          <div
            key={option.id}
            className={`flex items-center space-x-3 rounded-md border p-3 ${
              isDisabled ? "opacity-70" : ""
            } ${
              correctOption && isCorrect
                ? "border-green-500 bg-green-50"
                : correctOption && isSelected && !isCorrect
                ? "border-red-500 bg-red-50"
                : ""
            }`}
          >
            <RadioGroupItem
              value={option.id}
              id={`option-${option.id}`}
              className="h-5 w-5"
            />
            <Label
              htmlFor={`option-${option.id}`}
              className="flex-1 cursor-pointer text-sm leading-snug"
            >
              {option.text}
            </Label>
            {correctOption && isCorrect && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default MultipleChoiceExercise;
