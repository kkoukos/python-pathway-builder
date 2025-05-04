
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ActivitySummary from "./ActivitySummary";

interface ActivityCardProps {
  activeDays: number;
  activityData: {day: string, level: number}[];
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activeDays, activityData }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Activity</CardTitle>
        <CardDescription>
          {activeDays} active days this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ActivitySummary activityData={activityData} />
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
