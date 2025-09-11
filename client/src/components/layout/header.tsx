import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";
import { useState, useEffect } from "react";

type Reminder = {
  id: number;
  title: string;
  type: string;
  dueDate: string;
};

// Instead of a hardcoded string
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string;

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [location, setLocation] = useState("Coimbatore,IN");
  const [weather, setWeather] = useState<{ temp: number; condition: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock static reminders
  const overdueReminders: Reminder[] = [
    { id: 1, title: "Deworming", type: "Medicine", dueDate: "2025-08-20" },
    { id: 2, title: "FMD Vaccine", type: "Vaccination", dueDate: "2025-08-22" },
  ];
  const overdueCount = overdueReminders.length;

  // 🔹 Fetch weather when location changes
  async function fetchWeather(city: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("Weather API request failed");
      const data = await res.json();

      setWeather({
        temp: data.main.temp,
        condition: data.weather[0].main,
      });
    } catch (error) {
      console.error("Weather fetch error:", error);
      setWeather({ temp: 0, condition: "Unavailable" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWeather(location);
  }, [location]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="lg:hidden p-2">
              <Menu className="w-6 h-6" />
            </Button>
            <h1 className="ml-4 text-2xl font-semibold text-gray-900">
              Welcome to the Barn
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Weather Widget */}
            <div className="flex items-center px-3 py-1 bg-blue-50 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                ></path>
              </svg>

              {loading ? (
                <span className="text-sm text-gray-500">Loading...</span>
              ) : weather ? (
                <span className="text-sm text-blue-700">
                  {weather.temp}°C {weather.condition}
                </span>
              ) : (
                <span className="text-sm text-red-600">Weather unavailable</span>
              )}

              {/* Location Selector */}
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="ml-3 border rounded px-1 text-sm"
              >
                <option value="Coimbatore,IN">Coimbatore</option>
                <option value="Ernakulam,IN">Ernakulam</option>
                <option value="Munnar,IN">Munnar</option>
              </select>
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-6 h-6" />
                {overdueCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 rounded-full bg-red-600 text-white text-xs">
                    {overdueCount}
                  </span>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md z-50 p-4 border">
                  <h2 className="font-semibold text-sm mb-2">Overdue Reminders</h2>
                  {overdueCount === 0 ? (
                    <p className="text-gray-500 text-sm">No overdue reminders 🎉</p>
                  ) : (
                    <ul className="space-y-2 max-h-64 overflow-y-auto">
                      {overdueReminders.map((reminder) => (
                        <li key={reminder.id} className="text-sm text-gray-700">
                          🔔 <strong>{reminder.title}</strong> ({reminder.type}) was due on{" "}
                          <span className="text-red-600">
                            {new Date(reminder.dueDate).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
