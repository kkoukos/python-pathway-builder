
import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface Concept {
  id: number;
  name: string;
  mastery: number;
}

interface ConceptMasteryChartProps {
  concepts: Concept[];
}

const ConceptMasteryChart: React.FC<ConceptMasteryChartProps> = ({ concepts }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || concepts.length === 0) return;

    // Destroy existing chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: concepts.map((concept) => concept.name),
        datasets: [
          {
            label: "Concept Mastery",
            data: concepts.map((concept) => concept.mastery * 100),
            backgroundColor: "rgba(147, 51, 234, 0.2)",
            borderColor: "rgba(147, 51, 234, 0.8)",
            borderWidth: 2,
            pointBackgroundColor: "rgb(147, 51, 234)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(147, 51, 234)",
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              display: false,
              stepSize: 20,
            },
            pointLabels: {
              font: {
                size: 12,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Mastery: ${context.raw}%`;
              }
            }
          }
        },
      },
    });

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [concepts]);

  return (
    <div className="w-full h-full">
      <canvas ref={chartRef} />
      
      {/* Legend below chart */}
      <div className="mt-6 space-y-3">
        {concepts.map((concept) => (
          <div key={concept.id} className="flex justify-between items-center">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full bg-primary mr-2" 
                style={{ opacity: 0.2 + concept.mastery * 0.8 }}
              />
              <span className="text-sm">{concept.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${concept.mastery * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{Math.round(concept.mastery * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConceptMasteryChart;
