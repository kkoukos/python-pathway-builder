
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface OverallProgressCardProps {
  completedLessons: number;
  totalLessons: number;
}

const OverallProgressCard: React.FC<OverallProgressCardProps> = ({ completedLessons, totalLessons }) => {
  const overallPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Overall Progress</CardTitle>
        <CardDescription>
          {completedLessons} of {totalLessons} lessons completed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{completedLessons} lessons</span>
            <span>{overallPercentage}%</span>
          </div>
          <Progress value={overallPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallProgressCard;
