
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getModuleBySlug, getModuleTests } from "@/services/mockData";
import { Clock, ArrowRight, Trophy } from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";

const ModuleTests = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isTestCompleted } = useProgress();
  
  const module = slug ? getModuleBySlug(slug) : null;
  const tests = module ? getModuleTests(module.id) : [];

  if (!module) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Module not found. Please go back and select another module.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <Link to="/modules" className="hover:underline">
            Modules
          </Link>
          <span>/</span>
          <Link to={`/modules/${slug}`} className="hover:underline">
            {module.title}
          </Link>
          <span>/</span>
          <span>Tests</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Module Tests</h1>
        <p className="text-muted-foreground">
          Test your knowledge of {module.title} with these assessments.
        </p>
      </div>

      {tests.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No tests are available for this module yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tests.map((test) => {
            const isCompleted = isTestCompleted(module.id, test.id);
            
            return (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle>{test.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{test.description}</p>
                    </div>
                    {isCompleted && (
                      <div className="flex items-center justify-center bg-primary/10 p-2 rounded-full">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{test.timeLimit} minutes</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{test.passingScore}%</span>{" "}
                      <span className="text-muted-foreground">to pass</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <div className="flex justify-between items-center w-full">
                    <div>
                      {test.exercises?.length}{" "}
                      <span className="text-muted-foreground">questions</span>
                    </div>
                    <Button onClick={() => navigate(`/modules/${slug}/tests/${test.id}`)}>
                      {isCompleted ? "Review Test" : "Start Test"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ModuleTests;
