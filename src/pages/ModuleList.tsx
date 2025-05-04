
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { modules } from "@/services/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/contexts/ProgressContext";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

const ModuleList = () => {
  const { progress, getModuleProgress } = useProgress();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to access modules");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null; // This is a fallback; the useEffect will redirect
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Learning Modules</h1>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const completedLessons = getModuleProgress(module.id);
          const totalLessons = module.lessons.length;
          const progressPercentage = totalLessons > 0 
            ? Math.round((completedLessons / totalLessons) * 100) 
            : 0;
          
          return (
            <Card key={module.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between">
                  <Badge variant={progressPercentage === 100 ? "default" : "outline"}>
                    {progressPercentage === 100 
                      ? "Completed" 
                      : progressPercentage > 0 
                        ? "In Progress" 
                        : "Not Started"}
                  </Badge>
                </div>
                <CardTitle className="mt-2">{module.title}</CardTitle>
                <CardDescription>{module.lessons.length} Lessons</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">{module.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/modules/${module.slug}`} className="w-full">
                  <Button variant="default" className="w-full">
                    {progressPercentage === 0 ? "Start Module" : "Continue Module"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleList;
