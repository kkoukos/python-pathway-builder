
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { Achievement } from "@/services/profileService";

interface AchievementsCardProps {
  achievements: Achievement[];
}

const AchievementsCard: React.FC<AchievementsCardProps> = ({ achievements }) => {
  // Count earned achievements
  const earnedCount = achievements.filter(a => a.earned).length;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Achievements</CardTitle>
        <CardDescription>
          {earnedCount} out of {achievements.length} achievements earned
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.slice(0, 3).map(achievement => (
            <div 
              key={achievement.id} 
              className={`flex items-center gap-3 ${!achievement.earned ? 'opacity-50' : ''}`}
            >
              <div className="flex-shrink-0">
                {React.createElement(achievement.icon)}
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium">{achievement.title}</p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
              {achievement.earned ? (
                <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">
                  Earned
                </Badge>
              ) : (
                <Badge variant="outline" className="ml-auto">
                  Locked
                </Badge>
              )}
            </div>
          ))}
          
          {achievements.length > 3 && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              + {achievements.length - 3} more achievements
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsCard;
