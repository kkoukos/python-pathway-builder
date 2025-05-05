
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Achievement } from "@/services/profileService";

interface AchievementListProps {
  achievements: Achievement[];
}

const AchievementList: React.FC<AchievementListProps> = ({ achievements }) => {
  // Group achievements by earned/not earned
  const earnedAchievements = achievements.filter(a => a.earned);
  const lockedAchievements = achievements.filter(a => !a.earned);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Earned Achievements ({earnedAchievements.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {earnedAchievements.length === 0 ? (
            <p className="text-muted-foreground">No achievements earned yet. Keep learning!</p>
          ) : (
            earnedAchievements.map(achievement => {
              const IconComponent = achievement.icon;
              
              return (
                <div key={achievement.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                  <div className="flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    {achievement.earnedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">
                    Earned
                  </Badge>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Locked Achievements ({lockedAchievements.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lockedAchievements.map(achievement => {
            const IconComponent = achievement.icon;
            
            return (
              <div key={achievement.id} className="flex items-center gap-4 p-3 opacity-60">
                <div className="flex-shrink-0">
                  <IconComponent className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                <Badge variant="outline" className="ml-auto">
                  Locked
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementList;
