import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dumbbell, Coffee, Droplets, Timer } from "lucide-react";

export function ActivityLog() {
  const activities = [
    {
      type: "Exercise",
      description: "Morning Yoga Session",
      time: "08:00 AM",
      icon: Dumbbell,
      color: "text-green-500",
    },
    {
      type: "Meal",
      description: "Healthy Breakfast",
      time: "09:15 AM",
      icon: Coffee,
      color: "text-blue-500",
    },
    {
      type: "Hydration",
      description: "Water Intake",
      time: "10:30 AM",
      icon: Droplets,
      color: "text-cyan-500",
    },
    {
      type: "Exercise",
      description: "30min Walking",
      time: "12:00 PM",
      icon: Timer,
      color: "text-purple-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className={`${activity.color} p-2 rounded-full bg-white`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}