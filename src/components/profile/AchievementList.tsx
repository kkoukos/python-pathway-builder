
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Lock } from "lucide-react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedAt: string | null;
}

interface AchievementListProps {
  achievements: Achievement[];
}

const AchievementList: React.FC<AchievementListProps> = ({ achievements }) => {
  const earnedAchievements = achievements.filter(a => a.earned);
  const lockedAchievements = achievements.filter(a => !a.earned);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Earned ({earnedAchievements.length})</h3>
        {earnedAchievements.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            You haven't earned any achievements yet. Keep learning!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {earnedAchievements.map(achievement => (
              <TooltipProvider key={achievement.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-3 p-3 rounded-md border hover:bg-accent cursor-pointer">
                      <div className="bg-primary/10 rounded-full p-1.5">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-muted-foreground text-xs">{achievement.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {achievement.earnedAt && new Date(achievement.earnedAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{achievement.description}</p>
                    {achievement.earnedAt && (
                      <p className="text-xs text-muted-foreground">
                        Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Locked ({lockedAchievements.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lockedAchievements.map(achievement => (
            <TooltipProvider key={achievement.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-3 p-3 rounded-md border bg-muted/30 hover:bg-muted cursor-pointer">
                    <div className="bg-muted rounded-full p-1.5">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-muted-foreground text-xs">{achievement.description}</p>
                    </div>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Complete this achievement: {achievement.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementList;
