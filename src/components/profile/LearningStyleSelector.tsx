
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const learningStyles = [
  {
    id: "visual",
    title: "Visual Learner",
    description: "You learn best with images, diagrams, and spatial understanding",
  },
  {
    id: "auditory",
    title: "Auditory Learner",
    description: "You prefer learning through listening, discussions, and verbal explanations",
  },
  {
    id: "reading",
    title: "Reading/Writing Learner",
    description: "You learn best through reading material and writing notes",
  },
  {
    id: "kinesthetic",
    title: "Kinesthetic Learner",
    description: "You prefer hands-on activities and learn by doing",
  },
  {
    id: "balanced",
    title: "Balanced Learner",
    description: "You adapt to different learning styles depending on the context",
  },
];

interface LearningStyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const LearningStyleSelector: React.FC<LearningStyleSelectorProps> = ({ 
  value, 
  onChange 
}) => {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
      {learningStyles.map((style) => (
        <div
          key={style.id}
          className={`relative flex items-center space-x-3 rounded-md border p-3 transition-colors ${
            style.id === value 
              ? "border-primary bg-primary/5" 
              : "border-accent hover:bg-accent/50"
          }`}
          onClick={() => onChange(style.id)}
        >
          <RadioGroupItem value={style.id} id={`style-${style.id}`} />
          <Label
            htmlFor={`style-${style.id}`}
            className="flex-1 cursor-pointer"
          >
            <div className="font-medium">{style.title}</div>
            <p className="text-muted-foreground text-sm">{style.description}</p>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default LearningStyleSelector;
