
import React from "react";
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

const UserProfile = () => {
  const { user } = useAuth();
  const { progress, getModuleProgress } = useProgress();
  const isMobile = useIsMobile();
  
  // Calculate overall progress
  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const completedLessons = Object.values(progress).reduce(
    (sum, moduleProgress) => sum + moduleProgress.lessonsCompleted.length,
    0
  );
  const overallPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Calculate active days
  const calculateActiveDays = () => {
    // In a real app this would come from the backend
    return 12;
  };

  // Calculate daily learning streak
  const calculateStreak = () => {
    // In a real app this would come from the backend
    return 5;
  };

  // Achievements mock data
  const achievements = [
    {
      id: 1,
      title: "Fast Learner",
      description: "Complete your first lesson",
      icon: <Award className="h-6 w-6 text-primary" />,
      earned: true,
      earnedAt: new Date().toISOString()
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
      earned: calculateStreak() >= 5,
      earnedAt: calculateStreak() >= 5 ? new Date().toISOString() : null
    },
    {
      id: 4,
      title: "Module Expert",
      description: "Complete all lessons in a module",
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      earned: false,
      earnedAt: null
    }
  ];

  // Top concepts mock data
  const topConcepts = [
    { id: 1, name: "Variables", mastery: 0.9 },
    { id: 2, name: "Functions", mastery: 0.75 },
    { id: 3, name: "Lists", mastery: 0.6 },
    { id: 4, name: "Conditionals", mastery: 0.85 },
    { id: 5, name: "Loops", mastery: 0.7 },
  ];

  // Learning recommendations mock data
  const recommendations = [
    {
      id: 1,
      title: "Functions Deep Dive",
      type: "lesson",
      reason: "Based on your recent exercises",
      path: "/modules/python-basics/lessons/3"
    },
    {
      id: 2,
      title: "Lists Practice",
      type: "exercise",
      reason: "Suggested to improve mastery",
      path: "/modules/python-basics/lessons/2"
    }
  ];

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
            Level {Math.floor(completedLessons / 3) + 1}
          </Badge>
          <Badge variant="outline" className="text-sm font-medium">
            <Clock className="h-3.5 w-3.5 mr-1 text-blue-500" />
            {calculateStreak()} Day Streak
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
                  {calculateActiveDays()} active days this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivitySummary />
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
                    <div key={achievement.id} className={`rounded-full p-1.5 ${achievement.earned ? 'bg-primary/10' : 'bg-muted'}`}>
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
                  selected={new Date()}
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
