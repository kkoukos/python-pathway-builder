
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle } from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";
import { modules } from "@/services/mockData";

const Sidebar = () => {
  const location = useLocation();
  const { isLessonCompleted } = useProgress();

  return (
    <div className="flex flex-col h-full bg-sidebar border-r">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">
          Course Contents
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {modules.map((module) => (
            <div key={module.id} className="mb-6">
              <div className="mb-2 text-sidebar-foreground">
                <Link
                  to={`/modules/${module.slug}`}
                  className="text-md font-medium hover:text-sidebar-primary"
                >
                  {module.title}
                </Link>
              </div>
              <div className="pl-4 border-l border-sidebar-border">
                {module.lessons.map((lesson) => {
                  const isActive = location.pathname === `/modules/${module.slug}/lessons/${lesson.id}`;
                  const isCompleted = isLessonCompleted(module.id, lesson.id);

                  return (
                    <Link
                      key={lesson.id}
                      to={`/modules/${module.slug}/lessons/${lesson.id}`}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start mb-1 text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-primary",
                          isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                      >
                        <span className="truncate">{lesson.title}</span>
                        {isCompleted && (
                          <CheckCircle className="ml-2 h-4 w-4 text-green-400" />
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
