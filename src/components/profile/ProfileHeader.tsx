
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from "lucide-react";

interface ProfileHeaderProps {
  userName: string;
  level: number;
  streak: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userName, level, streak }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{userName}'s Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress, achievements, and learning insights
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-sm font-medium">
          <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
          Level {level}
        </Badge>
        <Badge variant="outline" className="text-sm font-medium">
          <Clock className="h-3.5 w-3.5 mr-1 text-blue-500" />
          {streak} Day Streak
        </Badge>
      </div>
    </div>
  );
};

export default ProfileHeader;
