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

type RevisionModule = {
  id: string;
  original_module_id: number;
  revision_module_id: number;
  assigned_at: string;
  completed_at?: string;
  is_mandatory: boolean;
  performance_threshold: number;
};

type UserPerformance = {
  id: string;
  module_id: number;
  average_score: number;
  failed_attempts: number;
  needs_revision: boolean;
  revision_assigned_at?: string;
  revision_completed_at?: string;
};

type ProgressContextType = {
  progress: Record<number, ModuleProgress>;
  revisionModules: RevisionModule[];
  userPerformance: UserPerformance[];
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
  hasMandatoryRevision: (moduleId: number) => boolean;
  hasRecommendedRevision: (moduleId: number) => boolean;
  markRevisionComplete: (revisionId: string) => Promise<void>;
  checkUserPerformance: (moduleId: number) => Promise<void>;
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
  const [revisionModules, setRevisionModules] = useState<RevisionModule[]>([]);
  const [userPerformance, setUserPerformance] = useState<UserPerformance[]>([]);

  // Load progress from Supabase when component mounts or user changes
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setProgress({});
      setRevisionModules([]);
      setUserPerformance([]);
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

        // Fetch revision modules
        const { data: revisionData, error: revisionError } = await supabase
          .from('revision_modules')
          .select('*')
          .eq('user_id', user.id);

        if (revisionError) {
          throw revisionError;
        }

        // Fetch user performance data
        const { data: performanceData, error: performanceError } = await supabase
          .from('user_performance')
          .select('*')
          .eq('user_id', user.id);

        if (performanceError) {
          throw performanceError;
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
        setRevisionModules(revisionData || []);
        setUserPerformance(performanceData || []);
      } catch (error) {
        console.error("Error fetching progress from Supabase:", error);
        toast.error("Failed to load your progress");
      }
    };

    fetchProgress();
  }, [user, isAuthenticated]);

  const checkUserPerformance = async (moduleId: number) => {
    if (!isAuthenticated || !user) return;

    try {
      // Get test results for this module
      const { data: testResults, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId);

      if (error) throw error;

      if (!testResults || testResults.length === 0) return;

      // Calculate performance metrics
      const scores = testResults.map(result => result.score);
      const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const failedAttempts = testResults.filter(result => !result.passed).length;

      // Performance thresholds
      const PERFORMANCE_THRESHOLD = 60; // Below 60% average triggers revision
      const MAX_FAILED_ATTEMPTS = 3; // More than 3 failed attempts triggers revision

      const needsRevision = averageScore < PERFORMANCE_THRESHOLD || failedAttempts >= MAX_FAILED_ATTEMPTS;
      const isMandatory = averageScore < 40; // Below 40% makes revision mandatory

      if (needsRevision) {
        // Check if revision is already assigned
        const existingRevision = revisionModules.find(
          rev => rev.original_module_id === moduleId && !rev.completed_at
        );

        if (!existingRevision) {
          // Assign revision module
          const { data: newRevision, error: revisionError } = await supabase
            .from('revision_modules')
            .insert({
              user_id: user.id,
              original_module_id: moduleId,
              revision_module_id: moduleId, // Same module for revision
              is_mandatory: isMandatory,
              performance_threshold: PERFORMANCE_THRESHOLD
            })
            .select()
            .single();

          if (revisionError) throw revisionError;

          if (newRevision) {
            setRevisionModules(prev => [...prev, newRevision]);
            
            if (isMandatory) {
              toast.warning(`Mandatory revision assigned for module ${moduleId}. You must complete this before proceeding.`);
            } else {
              toast.info(`Revision recommended for module ${moduleId} to improve your understanding.`);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error checking user performance:", error);
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

      // Check performance after test completion
      await checkUserPerformance(moduleId);

      // Check if the module is complete
      await checkAndMarkModuleComplete(moduleId);
    } catch (error) {
      console.error("Error recording test result:", error);
      toast.error("Failed to save your test results");
    }
  };

  const hasMandatoryRevision = (moduleId: number): boolean => {
    return revisionModules.some(
      rev => rev.original_module_id === moduleId && rev.is_mandatory && !rev.completed_at
    );
  };

  const hasRecommendedRevision = (moduleId: number): boolean => {
    return revisionModules.some(
      rev => rev.original_module_id === moduleId && !rev.is_mandatory && !rev.completed_at
    );
  };

  const markRevisionComplete = async (revisionId: string) => {
    if (!isAuthenticated || !user) return;

    try {
      const { error } = await supabase
        .from('revision_modules')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', revisionId)
        .eq('user_id', user.id);

      if (error) throw error;

      setRevisionModules(prev => 
        prev.map(rev => 
          rev.id === revisionId 
            ? { ...rev, completed_at: new Date().toISOString() }
            : rev
        )
      );

      toast.success("Revision module completed!");
    } catch (error) {
      console.error("Error marking revision complete:", error);
      toast.error("Failed to mark revision as complete");
    }
  };

  const markLessonComplete = async (moduleId: number, lessonId: number) => {
    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to save progress");
      return;
    }

    try {
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

      setProgress(prev => {
        const moduleProgress = prev[moduleId] || {
          moduleId,
          completed: false,
          lessonsCompleted: [],
          exercisesCompleted: {},
          testsCompleted: {},
          startedAt: new Date().toISOString()
        };

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

      setProgress(prev => {
        const moduleProgress = prev[moduleId] || {
          moduleId,
          completed: false,
          lessonsCompleted: [],
          exercisesCompleted: {},
          testsCompleted: {},
          startedAt: new Date().toISOString()
        };

        const lessonExercises = moduleProgress.exercisesCompleted[lessonId] || [];
        
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

      await checkAndMarkModuleComplete(moduleId);
    } catch (error) {
      console.error("Error marking exercise as complete:", error);
      toast.error("Failed to save your progress");
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
    
    return moduleProgress.lessonsCompleted.length;
  };

  const isModuleCompleted = (moduleId: number): boolean => {
    return !!progress[moduleId]?.completed;
  };

  const checkAndMarkModuleComplete = async (moduleId: number): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }

    const module = getModuleById(moduleId);
    if (!module) return false;

    const moduleProgress = progress[moduleId];
    if (!moduleProgress) return false;

    if (moduleProgress.completed) return true;

    const allLessonsCompleted = module.lessons.every(lesson => 
      moduleProgress.lessonsCompleted.includes(lesson.id)
    );

    const allExercisesCompleted = module.lessons.every(lesson => {
      if (!lesson.exercises || lesson.exercises.length === 0) return true;
      
      const completedExercises = moduleProgress.exercisesCompleted[lesson.id] || [];
      return lesson.exercises.every(exercise => 
        completedExercises.includes(exercise.id)
      );
    });

    const moduleTests = module.tests || [];
    const hasTests = moduleTests && moduleTests.length > 0;
    const allTestsPassed = hasTests ? moduleTests.every(test => {
      const testResult = moduleProgress.testsCompleted[test.id];
      return testResult && testResult.passed;
    }) : true;

    const isComplete = allLessonsCompleted && allExercisesCompleted && allTestsPassed;

    if (isComplete && !moduleProgress.completed) {
      try {
        setProgress(prev => ({
          ...prev,
          [moduleId]: {
            ...prev[moduleId],
            completed: true,
            completedAt: new Date().toISOString()
          }
        }));

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
    revisionModules,
    userPerformance,
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
    hasMandatoryRevision,
    hasRecommendedRevision,
    markRevisionComplete,
    checkUserPerformance
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};
