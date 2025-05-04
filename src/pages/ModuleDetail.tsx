
import React, { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ChevronRight, BookOpen, Code, Trophy } from "lucide-react";
import { getModuleBySlug } from "@/services/mockData";
import { useProgress } from "@/contexts/ProgressContext";

const ModuleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isLessonCompleted, isExerciseCompleted, isTestCompleted, isModuleCompleted, checkAndMarkModuleComplete } = useProgress();

  const module = slug ? getModuleBySlug(slug) : null;
  
  useEffect(() => {
    // Check if the module is complete when the component mounts
    if (module) {
      checkAndMarkModuleComplete(module.id);
    }
  }, [module, checkAndMarkModuleComplete]);

  if (!module) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Module not found. Please go back and select another module.
        </AlertDescription>
      </Alert>
    );
  }

  const moduleCompleted = isModuleCompleted(module.id);

  return (
    <div className="container">
      <div className="flex flex-col gap-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <Link to="/modules" className="hover:underline">
              Modules
            </Link>
            <span>/</span>
            <span>{module.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
            {moduleCompleted && (
              <div className="flex items-center text-primary">
                <Trophy className="h-5 w-5 mr-2" />
                <span className="font-medium">Module Completed</span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground">{module.description}</p>
        </div>

        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Lessons in this Module</h2>
            
            <Link to={`/modules/${slug}/tests`}>
              <Button variant="outline" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Module Tests
              </Button>
            </Link>
          </div>
          
          {module.lessons.map((lesson, index) => {
            const isCompleted = isLessonCompleted(module.id, lesson.id);
            
            // Check if all exercises in the lesson are completed
            const hasExercises = lesson.exercises && lesson.exercises.length > 0;
            const allExercisesCompleted = hasExercises ? lesson.exercises.every(
              exercise => isExerciseCompleted(module.id, lesson.id, exercise.id)
            ) : true;
            
            // A lesson is fully completed if the lesson itself is marked complete AND all exercises are completed
            const isFullyCompleted = isCompleted && allExercisesCompleted;

            return (
              <Card key={lesson.id} className={isFullyCompleted ? "border-primary/50 bg-primary/5" : ""}>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isFullyCompleted ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                    }`}>
                      {isFullyCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{lesson.title}</h3>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {lesson.content.length} content blocks
                        </span>
                        {lesson.exercises && lesson.exercises.length > 0 && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Code className="h-3.5 w-3.5" />
                            {lesson.exercises.length} exercises
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={isFullyCompleted ? "default" : "ghost"}
                    className="flex items-center gap-1"
                    onClick={() => navigate(`/modules/${slug}/lessons/${lesson.id}`)}
                  >
                    {isFullyCompleted ? "Review" : "Start"}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
        
        {module.tests && module.tests.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Module Tests</h2>
            <div className="grid gap-4">
              {module.tests.map((test) => {
                const isCompleted = isTestCompleted(module.id, test.id);
                
                return (
                  <Card key={test.id} className={isCompleted ? "border-primary/50 bg-primary/5" : ""}>
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isCompleted ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span>T</span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">{test.title}</h3>
                          <div className="mt-1 flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              {test.timeLimit} minute test
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {test.passingScore}% to pass
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={isCompleted ? "default" : "ghost"}
                        className="flex items-center gap-1"
                        onClick={() => navigate(`/modules/${slug}/tests/${test.id}`)}
                      >
                        {isCompleted ? "Review" : "Start"}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetail;
