
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { CheckCircle, AlertCircle, Code, HelpCircle, ChevronRight, BookOpen } from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";
import MultipleChoiceExercise from "./MultipleChoiceExercise";
import CodeExercise from "./CodeExercise";
import { Exercise } from "@/services/mockData";

interface ExerciseDetailProps {
  exercise: Exercise;
  moduleId: number;
  lessonId: number;
  onCompleted: () => void;
}

const ExerciseDetail: React.FC<ExerciseDetailProps> = ({ 
  exercise, 
  moduleId, 
  lessonId,
  onCompleted 
}) => {
  const { isExerciseCompleted, markExerciseComplete } = useProgress();
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string>("");
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const isCompleted = isExerciseCompleted(moduleId, lessonId, exercise.id);

  // Reset state when exercise changes
  useEffect(() => {
    setUserAnswer(null);
    setUserCode(exercise.content.starterCode || "");
    setShowHint(false);
    setIsCorrect(null);
    setShowSolution(false);
  }, [exercise.id, exercise.content.starterCode]);

  const handleSubmit = () => {
    let result = false;
    
    if (exercise.type === "multiple_choice") {
      result = userAnswer === exercise.content.correctOption;
    } else if (["code_completion", "code_writing", "debugging"].includes(exercise.type)) {
      // In a real app, this would send the code to the backend for validation
      // Here we'll simulate validation for demonstration purposes
      if (userCode.includes(exercise.content.solution)) {
        result = true;
      }
    }
    
    setIsCorrect(result);
    
    if (result) {
      markExerciseComplete(moduleId, lessonId, exercise.id);
      toast.success("Correct answer! Great job!");
      onCompleted();
    } else {
      toast.error("That's not quite right. Try again!");
    }
  };

  const handleReset = () => {
    setUserAnswer(null);
    setUserCode(exercise.content.starterCode || "");
    setShowHint(false);
    setIsCorrect(null);
    setShowSolution(false);
  };

  const handleShowHint = () => {
    setShowHint(true);
    // In a real app, you might want to track when hints are used
    // and potentially reduce the score for the exercise
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    // In a real app, showing the solution might mark the exercise as failed
    // or reduce the points earned
  };

  const renderExerciseByType = () => {
    switch (exercise.type) {
      case "multiple_choice":
        return (
          <MultipleChoiceExercise
            options={exercise.content.options}
            selectedOption={userAnswer}
            onSelectOption={setUserAnswer}
            isDisabled={isCompleted || isCorrect === true}
            correctOption={isCorrect === false && showSolution ? exercise.content.correctOption : undefined}
            exerciseId={exercise.id}
          />
        );
      case "code_completion":
      case "code_writing":
      case "debugging":
        return (
          <CodeExercise
            code={userCode}
            onCodeChange={setUserCode}
            isDisabled={isCompleted || isCorrect === true}
            solution={showSolution ? exercise.content.solution : undefined}
            testCases={exercise.content.testCases}
          />
        );
      default:
        return <p className="text-muted-foreground">Exercise type not supported.</p>;
    }
  };

  return (
    <Card className="w-full shadow-sm border-border">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            {exercise.title}
            {isCompleted && <CheckCircle className="text-primary h-5 w-5" />}
          </CardTitle>
          <div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                exercise.difficulty === "easy"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : exercise.difficulty === "medium"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {exercise.difficulty}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="bg-muted/50 p-4 rounded-md border border-border">
          <h3 className="font-semibold flex items-center gap-2 mb-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            Instructions
          </h3>
          <p className="whitespace-pre-line text-muted-foreground">{exercise.description}</p>
        </div>
        
        {showHint && exercise.content.hints && exercise.content.hints.length > 0 && (
          <div className="bg-accent/60 p-4 rounded-md border border-primary/20">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              Hint
            </h3>
            <p className="text-muted-foreground">{exercise.content.hints[0]}</p>
          </div>
        )}
        
        <div className="my-6">
          {renderExerciseByType()}
        </div>
        
        {isCorrect === false && showSolution && (
          <div className="bg-muted p-4 rounded-md border border-border">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Code className="h-4 w-4 text-primary" />
              Solution
            </h3>
            <div className="code-block bg-background p-3 rounded-md border border-border">
              <pre className="text-sm whitespace-pre-wrap font-mono">{exercise.content.solution}</pre>
            </div>
          </div>
        )}

        {isCorrect === true && (
          <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-md border border-green-200 dark:border-green-900/50">
            <h3 className="font-semibold flex items-center gap-2 mb-1">
              <CheckCircle className="h-5 w-5" />
              Well done!
            </h3>
            <p>You've successfully completed this exercise.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex gap-2">
          {!isCompleted && !showHint && exercise.content.hints && (
            <Button variant="outline" size="sm" onClick={handleShowHint}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Show Hint
            </Button>
          )}
          
          {isCorrect === false && !showSolution && (
            <Button variant="outline" size="sm" onClick={handleShowSolution}>
              <Code className="h-4 w-4 mr-2" />
              Show Solution
            </Button>
          )}

          {(isCorrect === false || isCompleted) && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              Try Again
            </Button>
          )}
        </div>
        
        {!isCompleted && isCorrect !== true && (
          <Button 
            onClick={handleSubmit}
            disabled={
              (exercise.type === "multiple_choice" && !userAnswer) ||
              (["code_completion", "code_writing", "debugging"].includes(exercise.type) && !userCode)
            }
          >
            Submit Answer
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
        
        {isCorrect === true && (
          <div className="flex items-center text-primary">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="font-medium">Correct!</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ExerciseDetail;
