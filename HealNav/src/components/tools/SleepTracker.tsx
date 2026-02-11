import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export function SleepTracker() {
  const [bedtime, setBedtime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [sleepDuration, setSleepDuration] = useState<string | null>(null);
  const [sleepQuality, setSleepQuality] = useState<string | null>(null);

  const calculateSleep = () => {
    if (bedtime && wakeTime) {
      const bedDateTime = new Date(`2000/01/01 ${bedtime}`);
      let wakeDateTime = new Date(`2000/01/01 ${wakeTime}`);
      
      // If wake time is earlier than bedtime, add one day to wake time
      if (wakeDateTime < bedDateTime) {
        wakeDateTime = new Date(`2000/01/02 ${wakeTime}`);
      }
      
      const diffInHours = (wakeDateTime.getTime() - bedDateTime.getTime()) / (1000 * 60 * 60);
      setSleepDuration(diffInHours.toFixed(1));
      
      // Determine sleep quality based on duration
      if (diffInHours < 6) {
        setSleepQuality("Insufficient");
      } else if (diffInHours < 7) {
        setSleepQuality("Fair");
      } else if (diffInHours < 9) {
        setSleepQuality("Good");
      } else {
        setSleepQuality("Excessive");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Sleep Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Bedtime</label>
          <Input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Wake Time</label>
          <Input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
          />
        </div>
        <Button onClick={calculateSleep} className="w-full">
          Calculate Sleep Duration
        </Button>
        {sleepDuration !== null && sleepQuality !== null && (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">
              Sleep Duration: {sleepDuration} hours
            </p>
            <p className={`font-medium ${
              sleepQuality === "Good" ? "text-green-500" :
              sleepQuality === "Fair" ? "text-yellow-500" :
              "text-red-500"
            }`}>
              Sleep Quality: {sleepQuality}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Recommended sleep duration: 7-9 hours for adults
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}