
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BookOpen } from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";
import { useNavigate } from "react-router-dom";
import { getModuleById } from "@/services/mockData";

const RevisionAlert: React.FC = () => {
  const { revisionModules } = useProgress();
  const navigate = useNavigate();

  // Get pending revisions (not completed)
  const pendingRevisions = revisionModules.filter(rev => !rev.completed_at);
  
  if (pendingRevisions.length === 0) {
    return null;
  }

  const mandatoryRevisions = pendingRevisions.filter(rev => rev.is_mandatory);
  const recommendedRevisions = pendingRevisions.filter(rev => !rev.is_mandatory);

  return (
    <div className="space-y-4">
      {mandatoryRevisions.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <div>
                <strong>Mandatory Revision Required</strong>
                <p className="text-sm mt-1">
                  Your performance indicates you need to review these modules before proceeding:
                </p>
              </div>
              <div className="space-y-2">
                {mandatoryRevisions.map((revision) => {
                  const module = getModuleById(revision.original_module_id);
                  return (
                    <div key={revision.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {module?.title || `Module ${revision.original_module_id}`}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/modules/${module?.slug}`)}
                        className="ml-2"
                      >
                        <BookOpen className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {recommendedRevisions.length > 0 && (
        <Alert>
          <BookOpen className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <div>
                <strong>Revision Recommended</strong>
                <p className="text-sm mt-1">
                  Based on your performance, we recommend reviewing these modules:
                </p>
              </div>
              <div className="space-y-2">
                {recommendedRevisions.map((revision) => {
                  const module = getModuleById(revision.original_module_id);
                  return (
                    <div key={revision.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {module?.title || `Module ${revision.original_module_id}`}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/modules/${module?.slug}`)}
                        className="ml-2"
                      >
                        <BookOpen className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default RevisionAlert;
