import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Footprints, Scale, Moon } from "lucide-react";

export function HealthMetrics() {
  const metrics = [
    {
      title: "Heart Rate",
      value: "72",
      unit: "bpm",
      icon: Heart,
      progress: 72,
      color: "text-red-500",
    },
    {
      title: "Daily Steps",
      value: "8,459",
      unit: "steps",
      icon: Footprints,
      progress: 84,
      color: "text-blue-500",
    },
    {
      title: "Weight",
      value: "165",
      unit: "lbs",
      icon: Scale,
      progress: 65,
      color: "text-green-500",
    },
    {
      title: "Sleep",
      value: "7.5",
      unit: "hours",
      icon: Moon,
      progress: 90,
      color: "text-purple-500",
    },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Health Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div key={metric.title} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <metric.icon className={`h-5 w-5 ${metric.color} mr-2`} />
                  <span className="font-medium">{metric.title}</span>
                </div>
                <span className="font-semibold">
                  {metric.value}
                  <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
                </span>
              </div>
              <Progress value={metric.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}