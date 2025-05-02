
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import { modules } from "@/services/mockData";
import { useProgress } from "@/contexts/ProgressContext";

const ModuleList = () => {
  const { getModuleProgress } = useProgress();

  return (
    <div className="container">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Python Learning Modules</h1>
          <p className="text-muted-foreground mb-6">
            Select a module to begin or continue your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => {
            const lessonsCount = module.lessons.length;
            const completedCount = getModuleProgress(module.id);
            const progressPercentage = lessonsCount > 0 
              ? Math.round((completedCount / lessonsCount) * 100)
              : 0;

            return (
              <Card key={module.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {lessonsCount} Lessons
                    </span>
                  </div>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/modules/${module.slug}`} className="w-full">
                    <Button className="w-full justify-between">
                      <span>{completedCount > 0 ? "Continue" : "Start"} Module</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModuleList;
