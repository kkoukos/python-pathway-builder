
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Trophy, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to LearnPlatform</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Master new skills with our comprehensive learning modules, interactive exercises, and knowledge tests.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Interactive Lessons</CardTitle>
            <CardDescription>
              Learn through engaging content with hands-on exercises and real-world examples.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Trophy className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Knowledge Tests</CardTitle>
            <CardDescription>
              Test your understanding with comprehensive assessments and get instant feedback.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Progress Tracking</CardTitle>
            <CardDescription>
              Monitor your learning journey with detailed progress analytics and achievements.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="text-center space-y-4">
        {isAuthenticated ? (
          <div className="space-x-4">
            <Link to="/modules">
              <Button size="lg" className="inline-flex items-center">
                Browse Modules
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" size="lg">
                View Profile
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            <Link to="/register">
              <Button size="lg" className="inline-flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>

      {isAuthenticated && (
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Jump back into your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Link to="/modules">
                <Button variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  All Modules
                </Button>
              </Link>
              <Link to="/progress">
                <Button variant="outline">
                  <Trophy className="mr-2 h-4 w-4" />
                  My Progress
                </Button>
              </Link>
              <Link to="/modules/intro-programming">
                <Button variant="outline">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Start Learning
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Home;
