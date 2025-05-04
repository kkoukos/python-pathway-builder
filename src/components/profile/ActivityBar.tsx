
import React from "react";
import { cn } from "@/lib/utils";

interface ActivityBarProps {
  day: string;
  level: number;
}

const ActivityBar: React.FC<ActivityBarProps> = ({ day, level }) => {
  const getActivityColor = (level: number) => {
    if (level === 0) return "bg-muted";
    if (level === 1) return "bg-primary/30";
    if (level === 2) return "bg-primary/50";
    if (level === 3) return "bg-primary/70";
    return "bg-primary";
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn(
        "w-4 rounded-sm",
        getActivityColor(level)
      )} 
      style={{ height: `${(level + 1) * 8}px` }} />
      <span className="text-xs text-muted-foreground">{day}</span>
    </div>
  );
};

export default ActivityBar;
