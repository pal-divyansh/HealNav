import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Scale, Heart, Activity } from "lucide-react";
import { BMICalculator } from "@/components/tools/BMICalculator";
import { CalorieCounter } from "@/components/tools/CalorieCounter";
import { HeartRateCalculator } from "@/components/tools/HeartRateCalculator";
import { ExercisePlanner } from "@/components/tools/ExercisePlanner";
import { useState } from "react";

const healthTools = [
  {
    title: "BMI Calculator",
    icon: Scale,
    description: "Calculate your Body Mass Index (BMI) and understand what it means for your health.",
    action: "Calculate BMI",
    id: "bmi"
  },
  {
    title: "Calorie Counter",
    icon: Calculator,
    description: "Track your daily caloric intake and maintain a healthy diet.",
    action: "Start Tracking",
    id: "calories"
  },
  {
    title: "Heart Rate Zone Calculator",
    icon: Heart,
    description: "Determine your target heart rate zones for optimal exercise performance.",
    action: "Calculate Zones",
    id: "heart-rate"
  },
  {
    title: "Exercise Planner",
    icon: Activity,
    description: "Create a personalized exercise plan based on your fitness goals.",
    action: "Create Plan",
    id: "exercise"
  }
];

export default function Tools() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const renderTool = () => {
    switch (activeTool) {
      case "bmi":
        return <BMICalculator />;
      case "calories":
        return <CalorieCounter />;
      case "heart-rate":
        return <HeartRateCalculator />;
      case "exercise":
        return <ExercisePlanner />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="mt-32">
        <PageHeader
          title="Health Calculators & Tools"
          subtitle="Use our interactive tools to track and improve your health."
        />
        
        <main className="container mx-auto px-4 py-8">
          {!activeTool ? (
            <div className="grid md:grid-cols-2 gap-6">
              {healthTools.map((tool) => (
                <Card
                  key={tool.title}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <tool.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                      <p className="text-gray-600 mb-4">{tool.description}</p>
                      <Button 
                        className="w-full md:w-auto"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTool(tool.id);
                        }}
                      >
                        {tool.action}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setActiveTool(null)}
                className="mb-4"
              >
                ← Back to Tools
              </Button>
              {renderTool()}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}