import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/contexts/ProgressContext";
import { modules } from "@/services/mockData";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Profile Components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabsContent from "@/components/profile/ProfileTabsContent";
import {
  calculateStreakFromDates,
  generateWeekActivity,
  generateAchievements,
  generateConcepts,
  generateRecommendations,
} from "@/services/profileService";

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const { progress, getModuleProgress } = useProgress();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [activeDays, setActiveDays] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [activityData, setActivityData] = useState<
    { day: string; level: number }[]
  >([]);

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
          .from("user_progress")
          .select("completed_at")
          .eq("user_id", user.id)
          .not("completed_at", "is", null);

        if (progressError) throw progressError;

        // Get unique dates when user completed lessons
        const uniqueDates = new Set();
        progressData?.forEach((item) => {
          if (item.completed_at) {
            const date = new Date(item.completed_at).toDateString();
            uniqueDates.add(date);
          }
        });

        // Set active days count
        const activeDaysCount = uniqueDates.size;
        setActiveDays(activeDaysCount);

        // Calculate streak
        const calculatedStreak = calculateStreakFromDates(
          Array.from(uniqueDates) as string[]
        );
        setStreak(calculatedStreak);

        // Calculate level based on completed lessons (1 level per 3 completed lessons)
        const completedLessons = Object.values(progress).reduce(
          (sum, moduleProgress) => sum + moduleProgress.lessonsCompleted.length,
          0
        );
        const calculatedLevel = Math.max(
          1,
          Math.floor(completedLessons / 3) + 1
        );
        setLevel(calculatedLevel);

        // Generate activity data for the last 7 days
        const weekActivity = generateWeekActivity(
          Array.from(uniqueDates) as string[]
        );
        setActivityData(weekActivity);
      } catch (error) {
        console.error("Error calculating user stats:", error);
        toast.error("Failed to load your progress statistics");
      }
    };

    calculateUserStats();
  }, [user, isAuthenticated, progress, navigate]);

  // Calculate overall progress
  const totalLessons = modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );
  const completedLessons = Object.values(progress).reduce(
    (sum, moduleProgress) => sum + moduleProgress.lessonsCompleted.length,
    0
  );

  // Generate dynamic achievements data based on actual user progress
  const achievements = generateAchievements(
    completedLessons,
    streak,
    modules,
    progress
  );

  // Top concepts with dynamic mastery levels based on completed lessons
  const concepts = generateConcepts(completedLessons);

  // Learning recommendations based on current progress
  const recommendations = generateRecommendations(completedLessons);

  // Handle date selection in calendar
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Check if user studied on this date by converting completed dates to strings
      const dateString = date.toDateString();
      const allCompletedDates: string[] = [];

      // Extract completed dates from progress
      Object.values(progress).forEach((module) => {
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
        username={user?.name || "User"}
        level={level}
        streak={streak}
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <ProfileTabsContent
          modules={modules}
          getModuleProgress={getModuleProgress}
          achievements={achievements}
          completedLessons={completedLessons}
          totalLessons={totalLessons}
          activeDays={activeDays}
          activityData={activityData}
          recommendations={recommendations}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          concepts={concepts}
        />
      </Tabs>
    </div>
  );
};

export default UserProfile;
