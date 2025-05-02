
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { getModuleBySlug, getTestById } from "@/services/mockData";
import { useProgress } from "@/contexts/ProgressContext";
import ExerciseDetail from "@/components/exercises/ExerciseDetail";
import { Clock, AlertTriangle, CheckCircle, X } from "lucide-react";

const TestView = () => {
  const { slug, testId } = useParams<{ slug: string; testId: string }>();
  const navigate = useNavigate();
  const { markTestComplete } = useProgress();
  
  const module = slug ? getModuleBySlug(slug) : null;
  const test = testId ? getTestById(parseInt(testId)) : null;
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(test?.timeLimit ? test.timeLimit * 60 : 0);
  const [testStarted, setTestStarted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState<{
    score: number;
    passed: boolean;
    timeSpent: number;
  } | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (testStarted && timeRemaining > 0 && !testCompleted) {
      timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (testStarted && timeRemaining <= 0 && !testCompleted) {
      handleSubmitTest();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [testStarted, timeRemaining, testCompleted]);

  if (!module || !test) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Test not found. Please go back and select another test.
        </AlertDescription>
      </Alert>
    );
  }

  const exercises = test.exercises || [];
  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;
  const progress = totalExercises > 0 ? ((currentExerciseIndex + 1) / totalExercises) * 100 : 0;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
    }
  };

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleSubmitTest = () => {
    // In a real app, this would send the answers to a backend service for validation
    // Here we'll simulate grading for demonstration purposes
    
    const answeredCount = Object.keys(answers).length;
    const correctCount = Math.floor(Math.random() * (answeredCount + 1)); // Simulating correct answers
    const score = totalExercises > 0 ? (correctCount / totalExercises) * 100 : 0;
    const passed = score >= (test.passingScore || 70);
    const timeSpent = test.timeLimit ? test.timeLimit * 60 - timeRemaining : 0;
    
    setTestCompleted(true);
    setTestResult({
      score,
      passed,
      timeSpent,
    });
    
    // Mark test as complete in progress context
    markTestComplete(module.id, test.id, score, passed);
  };

  // If the test isn't started yet, show the start screen
  if (!testStarted) {
    return (
      <div className="container max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <Link to="/modules" className="hover:underline">
              Modules
            </Link>
            <span>/</span>
            <Link to={`/modules/${slug}`} className="hover:underline">
              {module.title}
            </Link>
            <span>/</span>
            <Link to={`/modules/${slug}/tests`} className="hover:underline">
              Tests
            </Link>
            <span>/</span>
            <span>{test.title}</span>
          </div>
          <h1 className="text-3xl font-bold mb-6">{test.title}</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{test.description}</p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Time Limit:</span>
                <span>{test.timeLimit} minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Questions:</span>
                <span>{totalExercises}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Passing Score:</span>
                <span>{test.passingScore}%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t flex justify-center p-4">
            <Button size="lg" onClick={handleStartTest}>
              Start Test
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">
            Once you start the test, the timer will begin. You can navigate between
            questions freely.
          </p>
          <p>
            When you finish or when the time is up, you'll receive your score
            immediately.
          </p>
        </div>
      </div>
    );
  }

  // If the test is completed, show the results screen
  if (testCompleted && testResult) {
    return (
      <div className="container max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <Link to="/modules" className="hover:underline">
              Modules
            </Link>
            <span>/</span>
            <Link to={`/modules/${slug}`} className="hover:underline">
              {module.title}
            </Link>
            <span>/</span>
            <Link to={`/modules/${slug}/tests`} className="hover:underline">
              Tests
            </Link>
            <span>/</span>
            <span>{test.title}</span>
          </div>
          <h1 className="text-3xl font-bold mb-6">Test Results</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Your Score</CardTitle>
              <div className={`flex items-center gap-2 ${testResult.passed ? 'text-green-500' : 'text-red-500'}`}>
                {testResult.passed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <X className="h-5 w-5" />
                )}
                <span className="text-lg font-bold">
                  {testResult.passed ? "Passed" : "Failed"}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Score</span>
                <span>{Math.round(testResult.score)}%</span>
              </div>
              <Progress value={testResult.score} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Time Spent</div>
                <div className="text-lg">{formatTime(testResult.timeSpent)}</div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Passing Score</div>
                <div className="text-lg">{test.passingScore}%</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t flex justify-between p-4">
            <Button variant="outline" onClick={() => navigate(`/modules/${slug}/tests`)}>
              Back to Tests
            </Button>
            <Button onClick={() => navigate(`/modules/${slug}`)}>
              Continue Learning
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Main test view
  return (
    <div className="container max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <span>Question {currentExerciseIndex + 1} of {totalExercises}</span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{test.title}</h1>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className={`font-mono ${timeRemaining < 60 ? 'text-red-500' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>
      </div>
      
      {currentExercise && (
        <ExerciseDetail
          exercise={currentExercise}
          moduleId={module.id}
          lessonId={0} // Tests don't have a specific lesson ID
          onCompleted={() => {
            // Record answer
            setAnswers(prev => ({
              ...prev,
              [currentExercise.id]: true
            }));
            
            // Automatically move to next question if not the last one
            if (currentExerciseIndex < totalExercises - 1) {
              handleNextExercise();
            }
          }}
        />
      )}
      
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevExercise}
          disabled={currentExerciseIndex === 0}
        >
          Previous Question
        </Button>
        
        <div className="flex gap-2">
          {currentExerciseIndex === totalExercises - 1 ? (
            <Button 
              variant="default" 
              onClick={() => setShowConfirmSubmit(true)}
            >
              Finish Test
            </Button>
          ) : (
            <Button onClick={handleNextExercise}>
              Next Question
            </Button>
          )}
        </div>
      </div>
      
      <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Test?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your test? You won't be able to change your answers after submission.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
              <p>
                You've answered {Object.keys(answers).length} out of {totalExercises} questions.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmSubmit(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitTest}>
              Submit Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestView;
