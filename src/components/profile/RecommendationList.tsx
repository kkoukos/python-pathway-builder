
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Code } from "lucide-react";
import { Link } from "react-router-dom";

interface Recommendation {
  id: number;
  title: string;
  type: string;
  reason: string;
  path: string;
}

interface RecommendationListProps {
  recommendations: Recommendation[];
}

const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations }) => {
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return <BookOpen className="h-4 w-4" />;
      case "exercise":
        return <Code className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-3">
      {recommendations.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          No recommendations available yet. Keep learning!
        </p>
      ) : (
        recommendations.map(recommendation => (
          <Card key={recommendation.id} className="hover:bg-accent/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium">{recommendation.title}</h4>
                  <p className="text-xs text-muted-foreground">{recommendation.reason}</p>
                </div>
                <Link to={recommendation.path}>
                  <Button variant="outline" size="sm" className="gap-1">
                    {getRecommendationIcon(recommendation.type)}
                    {recommendation.type === "lesson" ? "Study" : "Practice"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default RecommendationList;
