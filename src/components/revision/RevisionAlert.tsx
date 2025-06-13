
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BookOpen } from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";

interface RevisionAlertProps {
  moduleId: number;
  testId: number;
  moduleName: string;
  testName: string;
  onStartRevision: () => void;
}

const RevisionAlert: React.FC<RevisionAlertProps> = ({
  moduleId,
  testId,
  moduleName,
  testName,
  onStartRevision
}) => {
  const { getRevisionRequirement } = useProgress();
  const revisionReq = getRevisionRequirement(moduleId, testId);

  if (!revisionReq || revisionReq.revisionCompleted) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Revision Required</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          You scored {Math.round(revisionReq.failedScore)}% on "{testName}" but need {revisionReq.requiredPassingScore}% to pass. 
          You must complete a revision course before retaking this test.
        </p>
        <Button onClick={onStartRevision} size="sm">
          <BookOpen className="h-4 w-4 mr-2" />
          Start Revision Course
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default RevisionAlert;
