
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, BookOpen } from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";
import { getModuleById } from "@/services/mockData";

interface RevisionCourseProps {
  moduleId: number;
  testId: number;
  onRevisionComplete: () => void;
}

const RevisionCourse: React.FC<RevisionCourseProps> = ({
  moduleId,
  testId,
  onRevisionComplete
}) => {
  const { markRevisionCompleted } = useProgress();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const module = getModuleById(moduleId);
  
  // Create revision content based on the module
  const revisionSteps = [
    {
      title: "Review Key Concepts",
      content: `Let's review the main concepts from ${module?.title}. Focus on the areas where you struggled in the test.`
    },
    {
      title: "Practice Exercises",
      content: "Complete additional practice exercises to reinforce your understanding."
    },
    {
      title: "Interactive Examples",
      content: "Work through step-by-step examples to see concepts in action."
    },
    {
      title: "Summary Review",
      content: "Review all the key points before retaking the test."
    }
  ];

  const handleNextStep = () => {
    if (currentStep < revisionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCompleteRevision();
    }
  };

  const handleCompleteRevision = async () => {
    setIsCompleted(true);
    await markRevisionCompleted(moduleId, testId);
    onRevisionComplete();
  };

  const progress = ((currentStep + 1) / revisionSteps.length) * 100;

  if (isCompleted) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <CardTitle>Revision Complete!</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>You have successfully completed the revision course. You can now retake the test.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-500" />
          <CardTitle>Revision Course - {module?.title}</CardTitle>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {revisionSteps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">{revisionSteps[currentStep].title}</h3>
        <p className="text-muted-foreground">{revisionSteps[currentStep].content}</p>
        
        {/* Simulated revision content */}
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm">
            📚 This is where interactive revision content would appear. In a real implementation, 
            this would include targeted lessons, practice problems, and explanations based on 
            the areas where you struggled in the test.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleNextStep} className="w-full">
          {currentStep < revisionSteps.length - 1 ? "Continue" : "Complete Revision"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RevisionCourse;
