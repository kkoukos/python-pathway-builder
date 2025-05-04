
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/components/ui/sonner";

interface CalendarCardProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

const CalendarCard: React.FC<CalendarCardProps> = ({ selectedDate, onDateSelect }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">Learning Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
};

export default CalendarCard;
