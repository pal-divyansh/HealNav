import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function BMICalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    if (!height || !weight) return;

    let bmiValue: number;
    if (unit === "metric") {
      // Height in cm, weight in kg
      bmiValue = (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2));
    } else {
      // Height in inches, weight in pounds
      bmiValue = (parseFloat(weight) / Math.pow(parseFloat(height), 2)) * 703;
    }
    setBmi(Math.round(bmiValue * 10) / 10);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-500" };
    if (bmi < 25) return { category: "Normal weight", color: "text-green-500" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-500" };
    return { category: "Obese", color: "text-red-500" };
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">BMI Calculator</h2>
      
      <div className="space-y-4">
        <RadioGroup
          defaultValue="metric"
          onValueChange={(value) => setUnit(value as "metric" | "imperial")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="metric" id="metric" />
            <Label htmlFor="metric">Metric</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="imperial" id="imperial" />
            <Label htmlFor="imperial">Imperial</Label>
          </div>
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor="height">Height ({unit === "metric" ? "cm" : "inches"})</Label>
          <Input
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={`Enter height in ${unit === "metric" ? "centimeters" : "inches"}`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight ({unit === "metric" ? "kg" : "lbs"})</Label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={`Enter weight in ${unit === "metric" ? "kilograms" : "pounds"}`}
          />
        </div>

        <Button onClick={calculateBMI} className="w-full">
          Calculate BMI
        </Button>

        {bmi && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-lg">Your BMI: <span className="font-bold">{bmi}</span></p>
            <p className={`text-lg ${getBMICategory(bmi).color}`}>
              Category: {getBMICategory(bmi).category}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}