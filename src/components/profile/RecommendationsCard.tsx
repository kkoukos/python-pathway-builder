
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RecommendationList from "@/components/profile/RecommendationList";

interface Recommendation {
  id: number;
  title: string;
  type: string;
  reason: string;
  path: string;
}

interface RecommendationsCardProps {
  recommendations: Recommendation[];
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">Recommended Next</CardTitle>
      </CardHeader>
      <CardContent>
        <RecommendationList recommendations={recommendations} />
      </CardContent>
    </Card>
  );
};

export default RecommendationsCard;
