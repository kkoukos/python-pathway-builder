import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Trophy, BookOpen, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/contexts/ProgressContext";
import { modules } from "@/services/mockData";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Profile Components
import ProfileHeader from "@/components/profile/ProfileHeader";
import OverallProgressCard from "@/components/profile/OverallProgressCard";
import ActivityCard from "@/components/profile/ActivityCard";
import AchievementsCard from "@/components/profile/AchievementsCard";
import CalendarCard from "@/components/profile/CalendarCard";
import RecommendationsCard from "@/components/profile/RecommendationsCard";
import ModuleProgressCard from "@/components/profile/ModuleProgressCard";
import AchievementList from "@/components/profile/AchievementList";
import ConceptMasteryCard from "@/components/profile/ConceptMasteryCard";

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const { progress, getModuleProgress } = useProgress();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeDays, setActiveDays] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [activityData, setActivityData] = useState<{day: string, level: number}[]>([]);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      toast.error("You must be logged in to view your profile");
      navigate("/login");
      return;
    }
    
    // Calculate active days, streak, and level based on actual user progress
    const calculateUserStats = async () => {
      if (!user) return;
      
      try {
        // Fetch user activity data for streak and active days
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('completed_at')
          .eq('user_id', user.id)
          .not('completed_at', 'is', null);
          
        if (progressError) throw progressError;
        
        // Get unique dates when user completed lessons
        const uniqueDates = new Set();
        progressData?.forEach(item => {
          if (item.completed_at) {
            const date = new Date(item.completed_at).toDateString();
            uniqueDates.add(date);
          }
        });
        
        // Set active days count
        const activeDaysCount = uniqueDates.size;
        setActiveDays(activeDaysCount);
        
        // Calculate streak
        const streak = calculateStreakFromDates(Array.from(uniqueDates) as string[]);
        setStreak(streak);
        
        // Calculate level based on completed lessons (1 level per 3 completed lessons)
        const completedLessons = Object.values(progress).reduce(
          (sum, moduleProgress) => sum + moduleProgress.lessonsCompleted.length, 0
        );
        const calculatedLevel = Math.max(1, Math.floor(completedLessons / 3) + 1);
        setLevel(calculatedLevel);
        
        // Generate activity data for the last 7 days
        const weekActivity = generateWeekActivity(Array.from(uniqueDates) as string[]);
        setActivityData(weekActivity);
        
      } catch (error) {
        console.error("Error calculating user stats:", error);
        toast.error("Failed to load your progress statistics");
      }
    };
    
    calculateUserStats();
  }, [user, isAuthenticated, progress, navigate]);
  
  // Calculate streak from array of date strings
  const calculateStreakFromDates = (dates: string[]): number => {
    if (dates.length === 0) return 0;
    
    // Convert string dates to Date objects and sort
    const sortedDates = dates.map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
    
    // Check if today is included
    const today = new Date().toDateString();
    const hasToday = sortedDates.some(d => d.toDateString() === today);
    
    // If no activity today, streak might have ended
    if (!hasToday) {
      // Check if yesterday is included to maintain streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      const hasYesterday = sortedDates.some(d => d.toDateString() === yesterdayStr);
      
      if (!hasYesterday) return 0; // Streak broken if no activity yesterday either
    }
    
    let currentStreak = hasToday ? 1 : 0;
    const processedDates = new Set();
    
    // Add today to processed dates if it exists
    if (hasToday) processedDates.add(today);
    
    // Start checking from yesterday and go backward
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - (hasToday ? 1 : 2)); // Start with yesterday or day before
    
    while (true) {
      const dateStr = currentDate.toDateString();
      const hasDate = sortedDates.some(d => d.toDateString() === dateStr);
      
      if (!hasDate) break; // Streak ends when we find a day with no activity
      
      if (!processedDates.has(dateStr)) {
        currentStreak++;
        processedDates.add(dateStr);
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return currentStreak;
  };
  
  // Generate weekly activity data
  const generateWeekActivity = (dates: string[]): {day: string, level: number}[] => {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const activity = [];
    
    // Get activity for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toDateString();
      
      // Count how many completions on this day
      const dayCompletions = dates.filter(d => new Date(d).toDateString() === dayStr).length;
      
      // Convert completion count to activity level (0-4)
      let level = 0;
      if (dayCompletions > 0) {
        level = Math.min(4, Math.ceil(dayCompletions / 2));
      }
      
      activity.push({
        day: weekdays[date.getDay()],
        level
      });
    }
    
    return activity;
  };

  // Calculate overall progress
  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const completedLessons = Object.values(progress).reduce(
    (sum, moduleProgress) => sum + moduleProgress.lessonsCompleted.length,
    0
  );

  // Generate dynamic achievements data based on actual user progress
  const achievements = [
    {
      id: 1,
      title: "Fast Learner",
      description: "Complete your first lesson",
      icon: <Award className="h-6 w-6 text-primary" />,
      earned: completedLessons > 0,
      earnedAt: completedLessons > 0 ? new Date().toISOString() : null
    },
    {
      id: 2,
      title: "Code Master",
      description: "Complete 10 code exercises",
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      earned: completedLessons >= 3,
      earnedAt: completedLessons >= 3 ? new Date().toISOString() : null
    },
    {
      id: 3,
      title: "Persistent Coder",
      description: "Maintain a 5-day learning streak",
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      earned: streak >= 5,
      earnedAt: streak >= 5 ? new Date().toISOString() : null
    },
    {
      id: 4,
      title: "Module Expert",
      description: "Complete all lessons in a module",
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      earned: Object.values(progress).some(module => 
        module.lessonsCompleted.length > 0 && 
        modules.find(m => m.id === module.moduleId)?.lessons.length === module.lessonsCompleted.length
      ),
      earnedAt: Object.values(progress).some(module => 
        module.lessonsCompleted.length > 0 && 
        modules.find(m => m.id === module.moduleId)?.lessons.length === module.lessonsCompleted.length
      ) ? new Date().toISOString() : null
    }
  ];

  // Top concepts with dynamic mastery levels based on completed lessons
  const topConcepts = [
    { id: 1, name: "Variables", mastery: calculateMastery(1, completedLessons) },
    { id: 2, name: "Functions", mastery: calculateMastery(2, completedLessons) },
    { id: 3, name: "Lists", mastery: calculateMastery(3, completedLessons) },
    { id: 4, name: "Conditionals", mastery: calculateMastery(4, completedLessons) },
    { id: 5, name: "Loops", mastery: calculateMastery(5, completedLessons) },
  ];

  // Calculate mastery level based on completed lessons
  function calculateMastery(conceptId: number, completedLessons: number): number {
    // Simple algorithm to calculate mastery:
    // Base level depending on concept complexity (earlier concepts easier to master)
    const baseLevel = Math.max(0.1, 1 - (conceptId * 0.1)); 
    
    // Additional mastery based on completed lessons
    const additionalMastery = Math.min(0.8, completedLessons * 0.1);
    
    return Math.min(0.95, baseLevel + additionalMastery);
  }

  // Learning recommendations based on current progress
  const recommendations = [
    {
      id: 1,
      title: completedLessons === 0 ? "Start Learning Python" : "Functions Deep Dive",
      type: "lesson",
      reason: completedLessons === 0 ? "Get started with Python" : "Based on your recent exercises",
      path: completedLessons === 0 ? "/modules/intro-to-python" : "/modules/python-fundamentals"
    },
    {
      id: 2,
      title: "Lists Practice",
      type: "exercise",
      reason: "Suggested to improve mastery",
      path: "/modules/python-fundamentals/lessons/4"
    }
  ];

  // Handle date selection in calendar
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Check if user studied on this date by converting completed dates to strings
      const dateString = date.toDateString();
      const allCompletedDates: string[] = [];
      
      // Extract completed dates from progress
      Object.values(progress).forEach(module => {
        if (module.completedAt) {
          allCompletedDates.push(new Date(module.completedAt).toDateString());
        }
      });
      
      const isStudyDay = allCompletedDates.includes(dateString);
      
      if (isStudyDay) {
        toast.info(`You studied on ${formattedDate}`);
      } else {
        toast.info(`No study activity recorded on ${formattedDate}`);
      }
    }
  };

  if (!isAuthenticated) {
    return null; // This is a fallback, but the useEffect should redirect
  }

  return (
    <div className="container space-y-6 py-6">
      <ProfileHeader 
        username={user?.name || 'User'} 
        level={level} 
        streak={streak} 
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="concepts">Concepts</TabsTrigger>
        </TabsList>

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
              onDateSelect={handleDateSelect}
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
          <ConceptMasteryCard concepts={topConcepts} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
