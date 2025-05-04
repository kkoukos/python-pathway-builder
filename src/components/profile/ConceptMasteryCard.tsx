
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ConceptMasteryChart from "@/components/profile/ConceptMasteryChart";
import { useIsMobile } from "@/hooks/use-mobile";

interface Concept {
  id: number;
  name: string;
  mastery: number;
}

interface ConceptMasteryCardProps {
  concepts: Concept[];
}

const ConceptMasteryCard: React.FC<ConceptMasteryCardProps> = ({ concepts }) => {
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Concept Mastery</CardTitle>
        <CardDescription>Visualize your understanding of key programming concepts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={isMobile ? "h-[300px]" : "h-[400px]"}>
          <ConceptMasteryChart concepts={concepts} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ConceptMasteryCard;
