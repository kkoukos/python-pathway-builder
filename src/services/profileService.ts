
import { Award, Trophy, BookOpen, Calendar } from "lucide-react";
import { ReactNode } from "react";
import { Module } from "./mockData";

// Calculate streak from array of date strings
export const calculateStreakFromDates = (dates: string[]): number => {
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
export const generateWeekActivity = (dates: string[]): {day: string, level: number}[] => {
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

// Calculate mastery level based on completed lessons
export const calculateMastery = (conceptId: number, completedLessons: number): number => {
  // Simple algorithm to calculate mastery:
  // Base level depending on concept complexity (earlier concepts easier to master)
  const baseLevel = Math.max(0.1, 1 - (conceptId * 0.1)); 
  
  // Additional mastery based on completed lessons
  const additionalMastery = Math.min(0.8, completedLessons * 0.1);
  
  return Math.min(0.95, baseLevel + additionalMastery);
};

// Generate achievements based on user progress
export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: any; // Changed from ReactNode to any to avoid JSX in .ts file
  earned: boolean;
  earnedAt: string | null;
}

export const generateAchievements = (
  completedLessons: number, 
  streak: number, 
  modules: Module[],
  progress: Record<string, any>
): Achievement[] => {
  return [
    {
      id: 1,
      title: "Fast Learner",
      description: "Complete your first lesson",
      icon: Award,
      earned: completedLessons > 0,
      earnedAt: completedLessons > 0 ? new Date().toISOString() : null
    },
    {
      id: 2,
      title: "Code Master",
      description: "Complete 10 code exercises",
      icon: Trophy,
      earned: completedLessons >= 3,
      earnedAt: completedLessons >= 3 ? new Date().toISOString() : null
    },
    {
      id: 3,
      title: "Persistent Coder",
      description: "Maintain a 5-day learning streak",
      icon: Calendar,
      earned: streak >= 5,
      earnedAt: streak >= 5 ? new Date().toISOString() : null
    },
    {
      id: 4,
      title: "Module Expert",
      description: "Complete all lessons in a module",
      icon: BookOpen,
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
};

// Generate concepts with mastery levels
export interface Concept {
  id: number;
  name: string;
  mastery: number;
}

export const generateConcepts = (completedLessons: number): Concept[] => {
  return [
    { id: 1, name: "Variables", mastery: calculateMastery(1, completedLessons) },
    { id: 2, name: "Functions", mastery: calculateMastery(2, completedLessons) },
    { id: 3, name: "Lists", mastery: calculateMastery(3, completedLessons) },
    { id: 4, name: "Conditionals", mastery: calculateMastery(4, completedLessons) },
    { id: 5, name: "Loops", mastery: calculateMastery(5, completedLessons) },
  ];
};

// Generate recommendations based on progress
export interface Recommendation {
  id: number;
  title: string;
  type: string;
  reason: string;
  path: string;
}

export const generateRecommendations = (completedLessons: number): Recommendation[] => {
  return [
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
};

// Convert HTML-like text to properly formatted content
export const formatLessonContent = (content: string): string => {
  if (!content) return "";
  
  // Replace markdown-style headers with proper HTML
  return content
    .replace(/##\s+([^#\n]+)/g, "<h2>$1</h2>")
    .replace(/###\s+([^#\n]+)/g, "<h3>$1</h3>")
    .replace(/####\s+([^#\n]+)/g, "<h4>$1</h4>");
};
