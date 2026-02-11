import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ZoneInfo {
  name: string;
  range: string;
  description: string;
  color: string;
}

export function HeartRateCalculator() {
  const [age, setAge] = useState("");
  const [restingHR, setRestingHR] = useState("");
  const [zones, setZones] = useState<ZoneInfo[]>([]);

  const calculateZones = () => {
    if (!age || !restingHR) return;

    const maxHR = 220 - parseInt(age);
    const hrReserve = maxHR - parseInt(restingHR);

    const calculateZoneHR = (percentLow: number, percentHigh: number) => {
      const low = Math.round(parseInt(restingHR) + (hrReserve * percentLow));
      const high = Math.round(parseInt(restingHR) + (hrReserve * percentHigh));
      return `${low} - ${high} bpm`;
    };

    const newZones: ZoneInfo[] = [
      {
        name: "Zone 1 - Recovery",
        range: calculateZoneHR(0.5, 0.6),
        description: "Very light intensity, good for recovery and warm-up",
        color: "text-green-500",
      },
      {
        name: "Zone 2 - Aerobic",
        range: calculateZoneHR(0.6, 0.7),
        description: "Light intensity, improves basic endurance",
        color: "text-blue-500",
      },
      {
        name: "Zone 3 - Tempo",
        range: calculateZoneHR(0.7, 0.8),
        description: "Moderate intensity, improves aerobic fitness",
        color: "text-yellow-500",
      },
      {
        name: "Zone 4 - Threshold",
        range: calculateZoneHR(0.8, 0.9),
        description: "Hard intensity, increases maximum performance",
        color: "text-orange-500",
      },
      {
        name: "Zone 5 - Maximum",
        range: calculateZoneHR(0.9, 1),
        description: "Maximum intensity, develops maximum performance",
        color: "text-red-500",
      },
    ];

    setZones(newZones);
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Heart Rate Zone Calculator</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="resting-hr">Resting Heart Rate</Label>
          <Input
            id="resting-hr"
            type="number"
            value={restingHR}
            onChange={(e) => setRestingHR(e.target.value)}
            placeholder="Enter your resting heart rate"
          />
        </div>

        <Button onClick={calculateZones} className="w-full">
          Calculate Zones
        </Button>

        {zones.length > 0 && (
          <div className="mt-6 space-y-4">
            {zones.map((zone, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className={`font-semibold ${zone.color}`}>{zone.name}</h3>
                <p className="text-lg font-bold">{zone.range}</p>
                <p className="text-sm text-gray-600">{zone.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
} 