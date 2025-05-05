
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActivityBar from "./ActivityBar";
import ActivityLegend from "./ActivityLegend";

interface ActivitySummaryProps {
  username: string; 
  level: number;
  streak: number;
  activityData: { day: string; level: number; }[];
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({
  username,
  level,
  streak,
  activityData,
}) => {
  return (
    <Card className="bg-background shadow-sm">
      <CardHeader>
        <CardTitle>Activity Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{username}</h3>
          <p className="text-muted-foreground">
            Level {level}, Current Streak: {streak} days
          </p>
        </div>
        <ActivityBar activityData={activityData} />
        <ActivityLegend />
      </CardContent>
    </Card>
  );
};

export default ActivitySummary;
