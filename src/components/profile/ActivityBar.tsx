
import React from "react";
import { cn } from "@/lib/utils";

interface ActivityData {
  day: string;
  level: number;
}

interface ActivityBarProps {
  activityData: ActivityData[];
}

const ActivityBar: React.FC<ActivityBarProps> = ({ activityData }) => {
  const getActivityColor = (level: number) => {
    if (level === 0) return "bg-muted";
    if (level === 1) return "bg-primary/30";
    if (level === 2) return "bg-primary/50";
    if (level === 3) return "bg-primary/70";
    return "bg-primary";
  };

  return (
    <div className="flex gap-1 justify-between w-full">
      {activityData.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-1">
          <div 
            className={cn("w-4 rounded-sm", getActivityColor(item.level))} 
            style={{ height: `${(item.level + 1) * 8}px` }} 
          />
          <span className="text-xs text-muted-foreground">{item.day}</span>
        </div>
      ))}
    </div>
  );
};

export default ActivityBar;
