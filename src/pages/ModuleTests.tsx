import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getModuleBySlug, getModuleTests } from "@/services/mockData";
import { Clock, ArrowRight, Trophy, AlertTriangle, BookOpen } from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";
import RevisionAlert from "@/components/revision/RevisionAlert";
import RevisionCourse from "@/components/revision/RevisionCourse";

const ModuleTests = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isTestCompleted, hasRevisionRequirement, getTestResult } = useProgress();
  const [showingRevision, setShowingRevision] = useState<{ moduleId: number; testId: number } | null>(null);
  
  const module = slug ? getModuleBySlug(slug) : null;
  const tests = module ? getModuleTests(module.id) : [];

  if (!module) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Module not found. Please go back and select another module.
        </AlertDescription>
      </Alert>
    );
  }

  const handleStartRevision = (moduleId: number, testId: number) => {
    setShowingRevision({ moduleId, testId });
  };

  const handleRevisionComplete = () => {
    setShowingRevision(null);
  };

  const canTakeTest = (testId: number) => {
    const hasRevision = hasRevisionRequirement(module.id, testId);
    const testResult = getTestResult(module.id, testId);
    
    // If user has never taken the test, they can take it
    if (!testResult) {
      return true;
    }
    
    // If user failed and has a revision requirement, they can't retake until revision is done
    if (hasRevision) {
      return false;
    }
    
    // Otherwise they can retake
    return true;
  };

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
          <span>Tests</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Module Tests</h1>
        <p className="text-muted-foreground">
          Test your knowledge of {module.title} with these assessments.
        </p>
      </div>

      {/* Show revision course if active */}
      {showingRevision && (
        <RevisionCourse
          moduleId={showingRevision.moduleId}
          testId={showingRevision.testId}
          onRevisionComplete={handleRevisionComplete}
        />
      )}

      {tests.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No tests are available for this module yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tests.map((test) => {
            const isCompleted = isTestCompleted(module.id, test.id);
            const hasRevision = hasRevisionRequirement(module.id, test.id);
            const testResult = getTestResult(module.id, test.id);
            const canTake = canTakeTest(test.id);
            
            return (
              <div key={test.id}>
                {/* Show revision alert if needed */}
                {hasRevision && (
                  <RevisionAlert
                    moduleId={module.id}
                    testId={test.id}
                    moduleName={module.title}
                    testName={test.title}
                    onStartRevision={() => handleStartRevision(module.id, test.id)}
                  />
                )}
                
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {test.title}
                          {hasRevision && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{test.description}</p>
                        {hasRevision && (
                          <p className="text-sm text-red-600 font-medium">
                            Revision required before retaking
                          </p>
                        )}
                      </div>
                      {isCompleted && !hasRevision && (
                        <div className="flex items-center justify-center bg-primary/10 p-2 rounded-full">
                          <Trophy className="h-5 w-5 text-primary" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{test.timeLimit} minutes</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{test.passingScore}%</span>{" "}
                        <span className="text-muted-foreground">to pass</span>
                      </div>
                    </div>
                    
                    {testResult && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Last score: </span>
                        <span className={`font-medium ${testResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.round(testResult.score)}%
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <div className="flex justify-between items-center w-full">
                      <div>
                        {test.exercises?.length}{" "}
                        <span className="text-muted-foreground">questions</span>
                      </div>
                      <div className="flex gap-2">
                        {hasRevision && (
                          <Button 
                            variant="outline" 
                            onClick={() => handleStartRevision(module.id, test.id)}
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Start Revision
                          </Button>
                        )}
                        <Button 
                          onClick={() => navigate(`/modules/${slug}/tests/${test.id}`)}
                          disabled={!canTake}
                        >
                          {isCompleted ? "Review Test" : "Start Test"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ModuleTests;
