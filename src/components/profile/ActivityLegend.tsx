
import React from "react";

const ActivityLegend: React.FC = () => {
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-sm bg-muted" />
        <span>None</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-sm bg-primary/30" />
        <span>Low</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-sm bg-primary/70" />
        <span>High</span>
      </div>
    </div>
  );
};

export default ActivityLegend;
