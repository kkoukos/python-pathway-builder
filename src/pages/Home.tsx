
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, CheckCircle, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { modules } from "@/services/mockData";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container py-8">
      <section className="py-12 px-4 md:px-6 text-center bg-gradient-to-b from-white to-slate-50 rounded-lg mb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Master Python Programming
          </h1>
          <p className="text-lg mb-8 text-gray-600">
            Learn Python from scratch with interactive lessons, hands-on exercises,
            and personalized progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/modules">
                <Button size="lg" className="gap-2">
                  Continue Learning <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg">Get Started Free</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Learn with Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Interactive Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our lessons include interactive code examples and exercises that
                help you learn by doing.
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CheckCircle className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Track Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Monitor your learning journey with our comprehensive progress
                tracking system.
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <User className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Personalized Path</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Learn at your own pace with content tailored to your skill level
                and learning style.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Available Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card key={module.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>
                  {module.lessons.length} Lessons
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">{module.description}</p>
              </CardContent>
              <CardFooter>
                <Link to={`/modules/${module.slug}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Module
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
