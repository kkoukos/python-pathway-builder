
import React from "react";
import { cn } from "@/lib/utils";

interface ActivityData {
  day: string;
  level: number;
}

interface ActivitySummaryProps {
  activityData?: ActivityData[];
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ activityData }) => {
  // Use provided activityData or fallback to mock data
  const data = activityData || [
    { day: "Mon", level: 3 },
    { day: "Tue", level: 2 },
    { day: "Wed", level: 4 },
    { day: "Thu", level: 1 },
    { day: "Fri", level: 3 },
    { day: "Sat", level: 0 },
    { day: "Sun", level: 2 },
  ];

  const getActivityColor = (level: number) => {
    if (level === 0) return "bg-muted";
    if (level === 1) return "bg-primary/30";
    if (level === 2) return "bg-primary/50";
    if (level === 3) return "bg-primary/70";
    return "bg-primary";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        {data.map((day, index) => (
          <div key={`${day.day}-${index}`} className="flex flex-col items-center gap-1">
            <div className={cn(
              "w-4 rounded-sm",
              getActivityColor(day.level)
            )} 
            style={{ height: `${(day.level + 1) * 8}px` }} />
            <span className="text-xs text-muted-foreground">{day.day}</span>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted" />
          <span>None</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-primary/30" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-primary/70" />
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

export default ActivitySummary;
