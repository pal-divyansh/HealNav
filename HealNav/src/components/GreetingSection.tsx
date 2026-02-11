import { useEffect, useState } from "react";

export function GreetingSection() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 mb-8">
      <h1 className="text-2xl font-semibold mb-2">
        {greeting}, <span className="text-primary">User</span>
      </h1>
      <p className="text-gray-600">
        Track your health journey and discover personalized wellness resources.
      </p>
    </div>
  );
}