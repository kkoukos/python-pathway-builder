
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";

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
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<number, ModuleProgress>>({});

  // Load progress from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedProgress = localStorage.getItem(`progress_${user.id}`);
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      }
    } else {
      setProgress({});
    }
  }, [user]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`progress_${user.id}`, JSON.stringify(progress));
    }
  }, [progress, user]);

  const markLessonComplete = (moduleId: number, lessonId: number) => {
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
            // If this was the last lesson in the module, mark module as complete
            // Note: This is simplified logic; in real app you'd check against total lessons
            completedAt: new Date().toISOString()
          }
        };
      }
      
      return prev;
    });
  };

  const markExerciseComplete = (moduleId: number, lessonId: number, exerciseId: number) => {
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
  };

  const markTestComplete = (moduleId: number, testId: number, score: number, passed: boolean) => {
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
