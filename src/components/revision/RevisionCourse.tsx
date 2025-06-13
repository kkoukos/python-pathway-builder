
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, BookOpen, Clock, Target, Lightbulb, PenTool, CheckSquare } from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";
import { getTestById } from "@/services/mockData";

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
  
  const test = getTestById(testId);
  const revisionContent = test?.revisionContent;
  
  // Fallback content if no specific revision content is available
  const defaultSteps = [
    {
      id: 1,
      title: "Review Key Concepts",
      content: `Let's review the main concepts from this test. Focus on the areas where you struggled.`,
      type: "concept" as const,
      duration: 10
    },
    {
      id: 2,
      title: "Practice Exercises",
      content: "Complete additional practice exercises to reinforce your understanding.",
      type: "practice" as const,
      duration: 15
    },
    {
      id: 3,
      title: "Summary Review",
      content: "Review all the key points before retaking the test.",
      type: "summary" as const,
      duration: 5
    }
  ];

  const revisionSteps = revisionContent?.steps || defaultSteps;
  const currentStepData = revisionSteps[currentStep];

  const getStepIcon = (type: string) => {
    switch (type) {
      case "concept":
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case "practice":
        return <PenTool className="h-4 w-4 text-green-500" />;
      case "example":
        return <Target className="h-4 w-4 text-purple-500" />;
      case "summary":
        return <CheckSquare className="h-4 w-4 text-orange-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case "concept":
        return "border-l-blue-500 bg-blue-50";
      case "practice":
        return "border-l-green-500 bg-green-50";
      case "example":
        return "border-l-purple-500 bg-purple-50";
      case "summary":
        return "border-l-orange-500 bg-orange-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

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
  const totalDuration = revisionSteps.reduce((sum, step) => sum + step.duration, 0);
  const currentDuration = revisionSteps.slice(0, currentStep + 1).reduce((sum, step) => sum + step.duration, 0);

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
          <p>You have successfully completed the revision course for "{test?.title}". You can now retake the test with improved knowledge!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-500" />
          <CardTitle>
            {revisionContent?.title || `Revision Course - ${test?.title}`}
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {revisionContent?.description || "Complete this revision course to improve your understanding before retaking the test."}
        </p>
        <div className="space-y-2 mt-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {revisionSteps.length}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{currentDuration}/{totalDuration} min</span>
              </div>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          {getStepIcon(currentStepData.type)}
          <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
          <span className="text-xs px-2 py-1 bg-muted rounded-full capitalize">
            {currentStepData.type}
          </span>
        </div>
        
        <div className={`border-l-4 p-4 rounded-r-lg ${getStepColor(currentStepData.type)}`}>
          <div className="prose prose-sm max-w-none">
            {currentStepData.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-2 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Estimated Duration</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {currentStepData.duration} minutes - Take your time to understand the concepts thoroughly.
          </p>
        </div>

        {/* Step navigation indicators */}
        <div className="flex gap-2 mt-4">
          {revisionSteps.map((step, index) => (
            <div
              key={step.id}
              className={`h-2 flex-1 rounded-full ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleNextStep} className="w-full">
          {currentStep < revisionSteps.length - 1 ? "Continue to Next Step" : "Complete Revision"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RevisionCourse;
