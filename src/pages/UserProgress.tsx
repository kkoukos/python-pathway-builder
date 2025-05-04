
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/contexts/ProgressContext";
import { useAuth } from "@/contexts/AuthContext";
import { modules } from "@/services/mockData";
import { toast } from "@/components/ui/sonner";

const UserProgress = () => {
  const { user, isAuthenticated } = useAuth();
  const { progress, getModuleProgress } = useProgress();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to view your progress");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Calculate overall progress
  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const completedLessons = Object.values(progress).reduce(
    (sum, moduleProgress) => sum + moduleProgress.lessonsCompleted.length,
    0
  );
  const overallPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  if (!isAuthenticated) {
    return null; // This is a fallback; the useEffect will redirect
  }

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">My Progress</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{completedLessons} of {totalLessons} lessons completed</span>
                <span>{overallPercentage}%</span>
              </div>
              <Progress value={overallPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mt-6 mb-4">Progress by Module</h2>

        {modules.map((module) => {
          const lessonsCount = module.lessons.length;
          const completedCount = getModuleProgress(module.id);
          const modulePercentage = lessonsCount > 0 
            ? Math.round((completedCount / lessonsCount) * 100)
            : 0;

          return (
            <Card key={module.id} className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <Link 
                    to={`/modules/${module.slug}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Module
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{completedCount} of {lessonsCount} lessons completed</span>
                    <span>{modulePercentage}%</span>
                  </div>
                  <Progress value={modulePercentage} className="h-2" />
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {module.lessons.map((lesson) => {
                    const isCompleted = progress[module.id]?.lessonsCompleted.includes(lesson.id);
                    return (
                      <Link 
                        key={lesson.id}
                        to={`/modules/${module.slug}/lessons/${lesson.id}`}
                        className="flex items-center gap-2 text-sm p-2 rounded hover:bg-accent"
                      >
                        <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-primary' : 'bg-muted'}`}></div>
                        <span className="truncate">{lesson.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UserProgress;
