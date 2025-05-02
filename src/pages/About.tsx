
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-3xl font-bold mb-6">About Python Learning Path</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-4">
            Python Learning Path is dedicated to making programming education accessible,
            interactive, and enjoyable for everyone. We believe in learning by doing
            and provide a structured approach to mastering Python programming.
          </p>
          <p>
            Our platform combines carefully crafted lessons with hands-on exercises
            and progress tracking to provide a comprehensive learning experience.
          </p>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-semibold mb-4">Learning Approach</h2>
      
      <div className="grid gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Structured Curriculum</h3>
            <p>
              Our lessons are organized into modules that build upon each other,
              ensuring you have a solid foundation before moving to more advanced topics.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Interactive Learning</h3>
            <p>
              Each lesson includes practical examples and exercises that reinforce
              the concepts you're learning, allowing you to apply your knowledge immediately.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Progress Tracking</h3>
            <p>
              Our system keeps track of your progress, helping you stay motivated
              and allowing you to easily pick up where you left off.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Future Roadmap</h2>
      <Card>
        <CardContent className="pt-6">
          <p className="mb-4">
            We're constantly working to improve and expand our platform. Here's what
            you can expect in the coming updates:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Interactive code execution environment</li>
            <li>Advanced progress analytics</li>
            <li>Additional modules covering more Python topics</li>
            <li>Community features for collaborative learning</li>
            <li>Adaptive learning pathways based on your progress and learning style</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
