
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

type ModuleProgress = {
  moduleId: number;
  completed: boolean;
  lessonsCompleted: number[];
  exercisesCompleted: Record<number, number[]>; // Lesson ID -> Exercise IDs
  testsCompleted: Record<number, { score: number; passed: boolean; completedAt: string }>;
  startedAt?: string;
  completedAt?: string;
};

type ProgressContextType = {
  progress: Record<number, ModuleProgress>;
  markLessonComplete: (moduleId: number, lessonId: number) => void;
  isLessonCompleted: (moduleId: number, lessonId: number) => boolean;
  markExerciseComplete: (moduleId: number, lessonId: number, exerciseId: number) => void;
  isExerciseCompleted: (moduleId: number, lessonId: number, exerciseId: number) => boolean;
  markTestComplete: (moduleId: number, testId: number, score: number, passed: boolean) => void;
  isTestCompleted: (moduleId: number, testId: number) => boolean;
  getTestResult: (moduleId: number, testId: number) => { score: number; passed: boolean } | null;
  getModuleProgress: (moduleId: number) => number;
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<Record<number, ModuleProgress>>({});

  // Load progress from Supabase when component mounts or user changes
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setProgress({});
      return;
    }

    const fetchProgress = async () => {
      try {
        // Fetch all completed lessons
        const { data: lessonData, error: lessonError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', true);

        if (lessonError) {
          throw lessonError;
        }

        // Fetch all exercise attempts
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('exercise_attempts')
          .select('*')
          .eq('user_id', user.id)
          .eq('correct', true);

        if (exerciseError) {
          throw exerciseError;
        }

        // Fetch all test results
        const { data: testData, error: testError } = await supabase
          .from('test_results')
          .select('*')
          .eq('user_id', user.id);

        if (testError) {
          throw testError;
        }

        // Convert the data to our progress structure
        const newProgress: Record<number, ModuleProgress> = {};

        // Process lesson data
        lessonData?.forEach(lesson => {
          const moduleId = lesson.module_id;
          if (!newProgress[moduleId]) {
            newProgress[moduleId] = {
              moduleId,
              completed: false,
              lessonsCompleted: [],
              exercisesCompleted: {},
              testsCompleted: {},
              startedAt: new Date().toISOString()
            };
          }

          newProgress[moduleId].lessonsCompleted.push(lesson.lesson_id);

          if (lesson.completed_at) {
            newProgress[moduleId].completedAt = lesson.completed_at;
          }
        });

        // Process exercise data
        exerciseData?.forEach(exercise => {
          const moduleId = exercise.module_id;
          const lessonId = exercise.lesson_id;
          const exerciseId = exercise.exercise_id;

          if (!newProgress[moduleId]) {
            newProgress[moduleId] = {
              moduleId,
              completed: false,
              lessonsCompleted: [],
              exercisesCompleted: {},
              testsCompleted: {},
              startedAt: new Date().toISOString()
            };
          }

          if (!newProgress[moduleId].exercisesCompleted[lessonId]) {
            newProgress[moduleId].exercisesCompleted[lessonId] = [];
          }

          if (!newProgress[moduleId].exercisesCompleted[lessonId].includes(exerciseId)) {
            newProgress[moduleId].exercisesCompleted[lessonId].push(exerciseId);
          }
        });

        // Process test data
        testData?.forEach(test => {
          const moduleId = test.module_id;
          const testId = test.test_id;

          if (!newProgress[moduleId]) {
            newProgress[moduleId] = {
              moduleId,
              completed: false,
              lessonsCompleted: [],
              exercisesCompleted: {},
              testsCompleted: {},
              startedAt: new Date().toISOString()
            };
          }

          newProgress[moduleId].testsCompleted[testId] = {
            score: Number(test.score),
            passed: test.passed,
            completedAt: test.completed_at
          };
        });

        setProgress(newProgress);
      } catch (error) {
        console.error("Error fetching progress from Supabase:", error);
        toast.error("Failed to load your progress");
      }
    };

    fetchProgress();
  }, [user, isAuthenticated]);

  const markLessonComplete = async (moduleId: number, lessonId: number) => {
    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to save progress");
      return;
    }

    try {
      // Update Supabase with the completed lesson
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,module_id,lesson_id'
        });

      if (error) {
        throw error;
      }

      // Update local state
      setProgress(prev => {
        // Get existing module progress or create new
        const moduleProgress = prev[moduleId] || {
          moduleId,
          completed: false,
          lessonsCompleted: [],
          exercisesCompleted: {},
          testsCompleted: {},
          startedAt: new Date().toISOString()
        };

        // Add lesson to completed lessons if not already included
        if (!moduleProgress.lessonsCompleted.includes(lessonId)) {
          const newLessonsCompleted = [...moduleProgress.lessonsCompleted, lessonId];
          
          return {
            ...prev,
            [moduleId]: {
              ...moduleProgress,
              lessonsCompleted: newLessonsCompleted,
              completedAt: new Date().toISOString()
            }
          };
        }
        
        return prev;
      });
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
      toast.error("Failed to save your progress");
    }
  };

  const markExerciseComplete = async (moduleId: number, lessonId: number, exerciseId: number) => {
    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to save progress");
      return;
    }

    try {
      // Record the exercise attempt in Supabase
      const { error } = await supabase
        .from('exercise_attempts')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          lesson_id: lessonId,
          exercise_id: exerciseId,
          correct: true
        });

      if (error) {
        throw error;
      }

      // Update local state
      setProgress(prev => {
        // Get existing module progress or create new
        const moduleProgress = prev[moduleId] || {
          moduleId,
          completed: false,
          lessonsCompleted: [],
          exercisesCompleted: {},
          testsCompleted: {},
          startedAt: new Date().toISOString()
        };

        // Get existing exercises for this lesson or create new array
        const lessonExercises = moduleProgress.exercisesCompleted[lessonId] || [];
        
        // Add exercise to completed exercises if not already included
        if (!lessonExercises.includes(exerciseId)) {
          const newExercisesCompleted = {
            ...moduleProgress.exercisesCompleted,
            [lessonId]: [...lessonExercises, exerciseId]
          };
          
          return {
            ...prev,
            [moduleId]: {
              ...moduleProgress,
              exercisesCompleted: newExercisesCompleted
            }
          };
        }
        
        return prev;
      });
    } catch (error) {
      console.error("Error marking exercise as complete:", error);
      toast.error("Failed to save your progress");
    }
  };

  const markTestComplete = async (moduleId: number, testId: number, score: number, passed: boolean) => {
    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to save test results");
      return;
    }

    try {
      // Record the test result in Supabase
      const { error } = await supabase
        .from('test_results')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          test_id: testId,
          score: score,
          passed: passed
        });

      if (error) {
        throw error;
      }

      // Update local state
      setProgress(prev => {
        // Get existing module progress or create new
        const moduleProgress = prev[moduleId] || {
          moduleId,
          completed: false,
          lessonsCompleted: [],
          exercisesCompleted: {},
          testsCompleted: {},
          startedAt: new Date().toISOString()
        };

        const newTestsCompleted = {
          ...moduleProgress.testsCompleted,
          [testId]: {
            score,
            passed,
            completedAt: new Date().toISOString()
          }
        };
        
        return {
          ...prev,
          [moduleId]: {
            ...moduleProgress,
            testsCompleted: newTestsCompleted
          }
        };
      });
    } catch (error) {
      console.error("Error recording test result:", error);
      toast.error("Failed to save your test results");
    }
  };

  const isLessonCompleted = (moduleId: number, lessonId: number): boolean => {
    return progress[moduleId]?.lessonsCompleted.includes(lessonId) || false;
  };

  const isExerciseCompleted = (moduleId: number, lessonId: number, exerciseId: number): boolean => {
    return progress[moduleId]?.exercisesCompleted[lessonId]?.includes(exerciseId) || false;
  };

  const isTestCompleted = (moduleId: number, testId: number): boolean => {
    return !!progress[moduleId]?.testsCompleted[testId] || false;
  };

  const getTestResult = (moduleId: number, testId: number) => {
    return progress[moduleId]?.testsCompleted[testId] || null;
  };

  const getModuleProgress = (moduleId: number): number => {
    const moduleProgress = progress[moduleId];
    if (!moduleProgress) return 0;
    
    // This is simplified logic; in a real app you'd calculate against total lessons
    // For now, just return the number of completed lessons as a proxy
    return moduleProgress.lessonsCompleted.length;
  };

  const value = {
    progress,
    markLessonComplete,
    isLessonCompleted,
    markExerciseComplete,
    isExerciseCompleted,
    markTestComplete,
    isTestCompleted,
    getTestResult,
    getModuleProgress
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};
