
import React from "react";
import ActivityBar from "./ActivityBar";
import ActivityLegend from "./ActivityLegend";

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

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        {data.map((day, index) => (
          <ActivityBar 
            key={`${day.day}-${index}`} 
            day={day.day} 
            level={day.level} 
          />
        ))}
      </div>
      
      <ActivityLegend />
    </div>
  );
};

export default ActivitySummary;
