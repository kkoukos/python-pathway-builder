
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedAt: string | null;
}

interface AchievementsCardProps {
  achievements: Achievement[];
}

const AchievementsCard: React.FC<AchievementsCardProps> = ({ achievements }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Achievements</CardTitle>
        <CardDescription>
          {achievements.filter(a => a.earned).length} of {achievements.length} unlocked
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {achievements.slice(0, 4).map(achievement => (
            <div 
              key={achievement.id} 
              className={`rounded-full p-1.5 ${achievement.earned ? 'bg-primary/10' : 'bg-muted'} transition-all cursor-pointer hover:scale-110`}
              onClick={() => toast.info(achievement.earned ? 
                `Achievement Unlocked: ${achievement.title}` : 
                `To unlock "${achievement.title}": ${achievement.description}`)}
            >
              {achievement.icon}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsCard;
