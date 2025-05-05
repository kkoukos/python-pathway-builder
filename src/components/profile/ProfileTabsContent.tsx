
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import OverallProgressCard from "@/components/profile/OverallProgressCard";
import ActivityCard from "@/components/profile/ActivityCard";
import AchievementsCard from "@/components/profile/AchievementsCard";
import CalendarCard from "@/components/profile/CalendarCard";
import RecommendationsCard from "@/components/profile/RecommendationsCard";
import ModuleProgressCard from "@/components/profile/ModuleProgressCard";
import AchievementList from "@/components/profile/AchievementList";
import ConceptMasteryCard from "@/components/profile/ConceptMasteryCard";
import { Module } from "@/services/mockData";

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedAt: string | null;
}

interface Concept {
  id: number;
  name: string;
  mastery: number;
}

interface Recommendation {
  id: number;
  title: string;
  type: string;
  reason: string;
  path: string;
}

interface ProfileTabsContentProps {
  modules: Module[];
  getModuleProgress: (moduleId: string) => any;
  achievements: Achievement[];
  completedLessons: number;
  totalLessons: number;
  activeDays: number;
  activityData: { day: string; level: number }[];
  recommendations: Recommendation[];
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  concepts: Concept[];
}

const ProfileTabsContent: React.FC<ProfileTabsContentProps> = ({
  modules,
  getModuleProgress,
  achievements,
  completedLessons,
  totalLessons,
  activeDays,
  activityData,
  recommendations,
  selectedDate,
  onDateSelect,
  concepts,
}) => {
  return (
    <>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <OverallProgressCard 
            completedLessons={completedLessons}
            totalLessons={totalLessons}
          />
          
          <ActivityCard 
            activeDays={activeDays}
            activityData={activityData}
          />
          
          <AchievementsCard 
            achievements={achievements}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CalendarCard 
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />
          
          <RecommendationsCard 
            recommendations={recommendations}
          />
        </div>
      </TabsContent>

      <TabsContent value="progress" className="space-y-4">
        <ModuleProgressCard 
          modules={modules}
          getModuleProgress={getModuleProgress}
        />
      </TabsContent>

      <TabsContent value="achievements" className="space-y-4">
        <AchievementList achievements={achievements} />
      </TabsContent>

      <TabsContent value="concepts" className="space-y-4">
        <ConceptMasteryCard concepts={concepts} />
      </TabsContent>
    </>
  );
};

export default ProfileTabsContent;
