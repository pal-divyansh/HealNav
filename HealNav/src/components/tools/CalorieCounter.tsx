import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FoodItem {
  name: string;
  calories: number;
  portion: string;
}

export function CalorieCounter() {
  const [meals, setMeals] = useState<{ [key: string]: FoodItem[] }>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });
  const [currentMeal, setCurrentMeal] = useState("breakfast");
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [portion, setPortion] = useState("");

  const addFoodItem = () => {
    if (!foodName || !calories || !portion) return;

    setMeals((prev) => ({
      ...prev,
      [currentMeal]: [
        ...prev[currentMeal],
        { name: foodName, calories: parseInt(calories), portion },
      ],
    }));

    setFoodName("");
    setCalories("");
    setPortion("");
  };

  const removeFoodItem = (mealType: string, index: number) => {
    setMeals((prev) => ({
      ...prev,
      [mealType]: prev[mealType].filter((_, i) => i !== index),
    }));
  };

  const getTotalCalories = () => {
    return Object.values(meals).reduce(
      (total, meal) => total + meal.reduce((sum, food) => sum + food.calories, 0),
      0
    );
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Calorie Counter</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select onValueChange={setCurrentMeal} defaultValue={currentMeal}>
              <SelectTrigger>
                <SelectValue placeholder="Select meal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="food-name">Food Item</Label>
            <Input
              id="food-name"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., Apple"
            />
          </div>
          <div>
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="e.g., 95"
            />
          </div>
          <div>
            <Label htmlFor="portion">Portion</Label>
            <Input
              id="portion"
              value={portion}
              onChange={(e) => setPortion(e.target.value)}
              placeholder="e.g., 1 medium"
            />
          </div>
        </div>

        <Button onClick={addFoodItem}>Add Food Item</Button>

        <div className="space-y-4 mt-6">
          {Object.entries(meals).map(([mealType, foods]) => (
            <div key={mealType} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold capitalize mb-2">{mealType}</h3>
              {foods.length > 0 ? (
                <ul className="space-y-2">
                  {foods.map((food, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>
                        {food.name} ({food.portion}) - {food.calories} calories
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFoodItem(mealType, index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No foods added yet</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/10 rounded-lg">
          <p className="text-lg font-semibold">
            Total Calories: {getTotalCalories()}
          </p>
        </div>
      </div>
    </Card>
  );
}