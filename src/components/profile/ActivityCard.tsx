
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ActivitySummary from "./ActivitySummary";
import { useAuth } from "@/contexts/AuthContext";

interface ActivityCardProps {
  activeDays: number;
  activityData: {day: string, level: number}[];
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activeDays, activityData }) => {
  const { user } = useAuth();
  const username = user?.name || 'User';
  // We'll use these values from UserProfile component in the future
  const level = 1;
  const streak = 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Activity</CardTitle>
        <CardDescription>
          {activeDays} active days this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ActivitySummary 
          username={username}
          level={level}
          streak={streak}
          activityData={activityData} 
        />
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
