import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { getModuleById } from "@/services/mockData";

type ModuleProgress = {
  moduleId: number;
  completed: boolean;
  lessonsCompleted: number[];
  exercisesCompleted: Record<number, number[]>; // Lesson ID -> Exercise IDs
  testsCompleted: Record<number, { score: number; passed: boolean; completedAt: string }>;
  startedAt?: string;
  completedAt?: string;
};

type RevisionRequirement = {
  id: string;
  moduleId: number;
  testId: number;
  failedScore: number;
  requiredPassingScore: number;
  revisionCompleted: boolean;
  revisionCompletedAt?: string;
  createdAt: string;
};

type ProgressContextType = {
  progress: Record<number, ModuleProgress>;
  revisionRequirements: RevisionRequirement[];
  markLessonComplete: (moduleId: number, lessonId: number) => void;
  isLessonCompleted: (moduleId: number, lessonId: number) => boolean;
  markExerciseComplete: (moduleId: number, lessonId: number, exerciseId: number) => void;
  isExerciseCompleted: (moduleId: number, lessonId: number, exerciseId: number) => boolean;
  markTestComplete: (moduleId: number, testId: number, score: number, passed: boolean) => void;
  isTestCompleted: (moduleId: number, testId: number) => boolean;
  getTestResult: (moduleId: number, testId: number) => { score: number; passed: boolean; completedAt: string } | null;
  getModuleProgress: (moduleId: number) => number;
  isModuleCompleted: (moduleId: number) => boolean;
  checkAndMarkModuleComplete: (moduleId: number) => Promise<boolean>;
  hasRevisionRequirement: (moduleId: number, testId: number) => boolean;
  markRevisionCompleted: (moduleId: number, testId: number) => Promise<void>;
  getRevisionRequirement: (moduleId: number, testId: number) => RevisionRequirement | null;
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
  const [revisionRequirements, setRevisionRequirements] = useState<RevisionRequirement[]>([]);

  // Load progress from Supabase when component mounts or user changes
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setProgress({});
      setRevisionRequirements([]);
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

        // Fetch revision requirements
        const { data: revisionData, error: revisionError } = await supabase
          .from('revision_requirements')
          .select('*')
          .eq('user_id', user.id);

        if (revisionError) {
          throw revisionError;
        }

        // Convert revision data to our format
        const revisions: RevisionRequirement[] = revisionData?.map(revision => ({
          id: revision.id,
          moduleId: revision.module_id,
          testId: revision.test_id,
          failedScore: Number(revision.failed_score),
          requiredPassingScore: Number(revision.required_passing_score),
          revisionCompleted: revision.revision_completed || false,
          revisionCompletedAt: revision.revision_completed_at || undefined,
          createdAt: revision.created_at
        })) || [];

        setRevisionRequirements(revisions);

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

      // Check if the module is complete
      await checkAndMarkModuleComplete(moduleId);
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

      // Check if the module is complete
      await checkAndMarkModuleComplete(moduleId);
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
          passed: passed,
          completed_at: new Date().toISOString()
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

      // Show appropriate message based on test result
      if (!passed) {
        toast.error(`Test failed with ${Math.round(score)}%. You need to complete a revision course before proceeding.`);
      } else {
        toast.success(`Test passed with ${Math.round(score)}%!`);
      }

      // Check if the module is complete
      await checkAndMarkModuleComplete(moduleId);
    } catch (error) {
      console.error("Error recording test result:", error);
      toast.error("Failed to save your test results");
    }
  };

  const markRevisionCompleted = async (moduleId: number, testId: number) => {
    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to mark revision as completed");
      return;
    }

    try {
      // Update the revision requirement in Supabase
      const { error } = await supabase
        .from('revision_requirements')
        .update({
          revision_completed: true,
          revision_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .eq('test_id', testId);

      if (error) {
        throw error;
      }

      // Update local state
      setRevisionRequirements(prev => 
        prev.map(req => 
          req.moduleId === moduleId && req.testId === testId
            ? { ...req, revisionCompleted: true, revisionCompletedAt: new Date().toISOString() }
            : req
        )
      );

      toast.success("Revision completed! You can now retake the test.");
    } catch (error) {
      console.error("Error marking revision as completed:", error);
      toast.error("Failed to mark revision as completed");
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

  const isModuleCompleted = (moduleId: number): boolean => {
    return !!progress[moduleId]?.completed;
  };

  const hasRevisionRequirement = (moduleId: number, testId: number): boolean => {
    return revisionRequirements.some(req => 
      req.moduleId === moduleId && 
      req.testId === testId && 
      !req.revisionCompleted
    );
  };

  const getRevisionRequirement = (moduleId: number, testId: number): RevisionRequirement | null => {
    return revisionRequirements.find(req => 
      req.moduleId === moduleId && req.testId === testId
    ) || null;
  };

  const checkAndMarkModuleComplete = async (moduleId: number): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }

    // Get the module
    const module = getModuleById(moduleId);
    if (!module) return false;

    // Get current progress
    const moduleProgress = progress[moduleId];
    if (!moduleProgress) return false;

    // If already completed, return true
    if (moduleProgress.completed) return true;

    // Check if all lessons are completed
    const allLessonsCompleted = module.lessons.every(lesson => 
      moduleProgress.lessonsCompleted.includes(lesson.id)
    );

    // Check if all exercises in all lessons are completed
    const allExercisesCompleted = module.lessons.every(lesson => {
      if (!lesson.exercises || lesson.exercises.length === 0) return true;
      
      const completedExercises = moduleProgress.exercisesCompleted[lesson.id] || [];
      return lesson.exercises.every(exercise => 
        completedExercises.includes(exercise.id)
      );
    });

    // Check if final tests are completed and passed (if they exist)
    const moduleTests = module.tests || []; // Safe access to tests property
    const hasTests = moduleTests && moduleTests.length > 0;
    const allTestsPassed = hasTests ? moduleTests.every(test => {
      const testResult = moduleProgress.testsCompleted[test.id];
      return testResult && testResult.passed;
    }) : true;

    // For module to be completed:
    // 1. All lessons must be completed
    // 2. All exercises must be completed
    // 3. If there are tests, all tests must be passed
    // 4. No pending revision requirements
    const noPendingRevisions = !moduleTests.some(test => 
      hasRevisionRequirement(moduleId, test.id)
    );

    const isComplete = allLessonsCompleted && allExercisesCompleted && allTestsPassed && noPendingRevisions;

    if (isComplete && !moduleProgress.completed) {
      try {
        // Update local state first
        setProgress(prev => ({
          ...prev,
          [moduleId]: {
            ...prev[moduleId],
            completed: true,
            completedAt: new Date().toISOString()
          }
        }));

        // We don't have a specific table for module completion,
        // but we could record it in a future implementation
        
        toast.success(`${module.title} module completed!`);
        return true;
      } catch (error) {
        console.error("Error marking module as complete:", error);
        return false;
      }
    }

    return isComplete;
  };

  const value = {
    progress,
    revisionRequirements,
    markLessonComplete,
    isLessonCompleted,
    markExerciseComplete,
    isExerciseCompleted,
    markTestComplete,
    isTestCompleted,
    getTestResult,
    getModuleProgress,
    isModuleCompleted,
    checkAndMarkModuleComplete,
    hasRevisionRequirement,
    markRevisionCompleted,
    getRevisionRequirement
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};
