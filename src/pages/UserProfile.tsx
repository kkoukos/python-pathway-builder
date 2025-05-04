
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, BookOpen, Clock, Calendar, Star } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/contexts/ProgressContext";
import { modules } from "@/services/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import AchievementList from "@/components/profile/AchievementList";
import ConceptMasteryChart from "@/components/profile/ConceptMasteryChart";
import ActivitySummary from "@/components/profile/ActivitySummary";
import RecommendationList from "@/components/profile/RecommendationList";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const { progress, getModuleProgress } = useProgress();
  const isMobile = useIsMobile();
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
  const overallPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{user?.name}'s Dashboard</h1>
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="concepts">Concepts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Activity</CardTitle>
                <CardDescription>
                  {activeDays} active days this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivitySummary activityData={activityData} />
              </CardContent>
            </Card>
            
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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Learning Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Recommended Next</CardTitle>
              </CardHeader>
              <CardContent>
                <RecommendationList recommendations={recommendations} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Module Progress</CardTitle>
              <CardDescription>Your progress through each learning module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules.map((module) => {
                  const lessonsCount = module.lessons.length;
                  const completedCount = getModuleProgress(module.id);
                  const modulePercentage = lessonsCount > 0 
                    ? Math.round((completedCount / lessonsCount) * 100)
                    : 0;

                  return (
                    <div key={module.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">{module.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {modulePercentage}%
                        </span>
                      </div>
                      <Progress value={modulePercentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {completedCount} of {lessonsCount} lessons completed
                      </p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Track your learning milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <AchievementList achievements={achievements} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="concepts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Concept Mastery</CardTitle>
              <CardDescription>Visualize your understanding of key programming concepts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={isMobile ? "h-[300px]" : "h-[400px]"}>
                <ConceptMasteryChart concepts={topConcepts} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
