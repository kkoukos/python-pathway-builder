
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Module {
  id: number;
  title: string;
  lessons: any[];
}

interface ModuleProgressCardProps {
  modules: Module[];
  getModuleProgress: (moduleId: number) => number;
}

const ModuleProgressCard: React.FC<ModuleProgressCardProps> = ({ modules, getModuleProgress }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Progress</CardTitle>
        <CardDescription>Your progress through each learning module</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {modules.map((module) => {
            const lessonsCount = module.lessons.length;
            const completedCount = getModuleProgress(module.id);
            const modulePercentage = lessonsCount > 0 
              ? Math.round((completedCount / lessonsCount) * 100)
              : 0;

            return (
              <div key={module.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">{module.title}</h4>
                  <span className="text-sm text-muted-foreground">
                    {modulePercentage}%
                  </span>
                </div>
                <Progress value={modulePercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {completedCount} of {lessonsCount} lessons completed
                </p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleProgressCard;
