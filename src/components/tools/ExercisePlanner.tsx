import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight: string;
  notes: string;
}

interface WorkoutPlan {
  day: string;
  exercises: Exercise[];
}

export function ExercisePlanner() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan[]>([]);
  const [currentDay, setCurrentDay] = useState("monday");
  const [exercise, setExercise] = useState<Exercise>({
    name: "",
    sets: 3,
    reps: "",
    weight: "",
    notes: "",
  });

  const addExercise = () => {
    if (!exercise.name || !exercise.reps) return;

    setWorkoutPlan((prev) => {
      const dayIndex = prev.findIndex((p) => p.day === currentDay);
      if (dayIndex === -1) {
        return [...prev, { day: currentDay, exercises: [exercise] }];
      }

      const newPlan = [...prev];
      newPlan[dayIndex].exercises.push(exercise);
      return newPlan;
    });

    setExercise({
      name: "",
      sets: 3,
      reps: "",
      weight: "",
      notes: "",
    });
  };

  const removeExercise = (day: string, index: number) => {
    setWorkoutPlan((prev) =>
      prev.map((p) =>
        p.day === day
          ? { ...p, exercises: p.exercises.filter((_, i) => i !== index) }
          : p
      )
    );
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Exercise Planner</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="workout-day">Workout Day</Label>
            <Select onValueChange={setCurrentDay} defaultValue={currentDay}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
                <SelectItem value="saturday">Saturday</SelectItem>
                <SelectItem value="sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="exercise-name">Exercise</Label>
            <Input
              id="exercise-name"
              value={exercise.name}
              onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
              placeholder="e.g., Squats"
            />
          </div>
          <div>
            <Label htmlFor="sets">Sets</Label>
            <Input
              id="sets"
              type="number"
              value={exercise.sets}
              onChange={(e) =>
                setExercise({ ...exercise, sets: parseInt(e.target.value) })
              }
            />
          </div>
          <div>
            <Label htmlFor="reps">Reps</Label>
            <Input
              id="reps"
              value={exercise.reps}
              onChange={(e) => setExercise({ ...exercise, reps: e.target.value })}
              placeholder="e.g., 12 or 8-12"
            />
          </div>
          <div>
            <Label htmlFor="weight">Weight (optional)</Label>
            <Input
              id="weight"
              value={exercise.weight}
              onChange={(e) => setExercise({ ...exercise, weight: e.target.value })}
              placeholder="e.g., 50kg"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={exercise.notes}
            onChange={(e) => setExercise({ ...exercise, notes: e.target.value })}
            placeholder="Additional notes or instructions"
          />
        </div>

        <Button onClick={addExercise}>Add Exercise</Button>

        <div className="mt-6 space-y-6">
          {workoutPlan.map((day) => (
            <div key={day.day} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold capitalize mb-4">{day.day}</h3>
              {day.exercises.map((ex, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start border-b py-2"
                >
                  <div>
                    <p className="font-medium">{ex.name}</p>
                    <p className="text-sm text-gray-600">
                      {ex.sets} sets × {ex.reps} reps
                      {ex.weight && ` @ ${ex.weight}`}
                    </p>
                    {ex.notes && (
                      <p className="text-sm text-gray-500 mt-1">{ex.notes}</p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeExercise(day.day, index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
} 