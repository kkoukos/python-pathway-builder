
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle } from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";
import ExerciseDetail from "./ExerciseDetail";
import { Exercise } from "@/services/mockData";

interface ExerciseListProps {
  exercises: Exercise[];
  lessonId: number;
  moduleId: number;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, lessonId, moduleId }) => {
  const { isExerciseCompleted } = useProgress();
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(
    exercises.length > 0 ? exercises[0].id : null
  );

  // If there are no exercises, show a message
  if (!exercises || exercises.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No exercises available for this lesson.
          </p>
        </CardContent>
      </Card>
    );
  }

  const selectedExercise = exercises.find((ex) => ex.id === selectedExerciseId);

  // For mobile, we'll use a full-width layout
  // For desktop, we'll use a sidebar layout
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <Card className="mb-6 sticky top-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Exercise List</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Accordion type="single" collapsible defaultValue="exercises">
              <AccordionItem value="exercises" className="border-none">
                <AccordionTrigger className="py-2 px-1">
                  All Exercises ({exercises.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2.5 mt-3">
                    {exercises.map((exercise) => {
                      const isCompleted = isExerciseCompleted(moduleId, lessonId, exercise.id);
                      
                      return (
                        <div
                          key={exercise.id}
                          className={`flex items-center justify-between p-2.5 rounded-md transition-colors cursor-pointer ${
                            exercise.id === selectedExerciseId
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent/50"
                          }`}
                          onClick={() => setSelectedExerciseId(exercise.id)}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border border-muted-foreground shrink-0"></div>
                            )}
                            <span className="text-sm font-medium truncate">
                              {exercise.title}
                            </span>
                          </div>
                          <div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
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
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-3">
        {selectedExercise && (
          <ExerciseDetail
            exercise={selectedExercise}
            moduleId={moduleId}
            lessonId={lessonId}
            onCompleted={() => {
              // Find the next uncompleted exercise
              const currentIndex = exercises.findIndex(ex => ex.id === selectedExerciseId);
              const nextExercises = exercises.slice(currentIndex + 1);
              const nextUncompleted = nextExercises.find(ex => !isExerciseCompleted(moduleId, lessonId, ex.id));
              
              if (nextUncompleted) {
                setSelectedExerciseId(nextUncompleted.id);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ExerciseList;
