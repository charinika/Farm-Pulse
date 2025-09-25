import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useReminders } from "@/components/reminders/RemindersContext";
import { useLocation } from "wouter";

// ✅ Language context + translations
import { useLanguage } from "@/pages/LanguageContext";
import { useTranslatedText } from "@/hooks/useTranslatedText";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string;

export default function Header() {
  const [, setLocation] = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [location, setLocationState] = useState("Coimbatore,IN");
  const [weather, setWeather] = useState<{ temp: number; condition: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const { reminders } = useReminders();
  const { lang, setLang } = useLanguage();

  // ✅ Get translations
  const tHome = useTranslatedText("home");
  const tFarmPulse = useTranslatedText("farm_pulse");
  const tWeatherUnavailable = useTranslatedText("weather_unavailable");
  const tNotifications = useTranslatedText("notifications");

  async function fetchWeather(city: string) {
    setLoading(true);
    setWeather(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error(`Weather API request failed for ${city}`);
      const data = await res.json();
      setWeather({
        temp: Math.round(data.main.temp),
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

  const now = new Date();
  const upcomingReminders = reminders.filter((rem) => {
    const due = new Date(rem.dueDate);
    const diffMinutes = (due.getTime() - now.getTime()) / (1000 * 60);
    return due >= now && diffMinutes <= 24 * 60;
  });
  const overdueReminders = reminders.filter((rem) => new Date(rem.dueDate) < now);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach((rem) => {
        const due = new Date(rem.dueDate);
        const diffMinutes = (due.getTime() - now.getTime()) / (1000 * 60);
        if (diffMinutes <= 10 && diffMinutes > 0) {
          toast.info(
            `⏰ ${rem.title} (${rem.type}) is due at ${due.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}. Try to complete it soon!`,
            { position: "top-right", autoClose: 5000, theme: "colored" }
          );
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

  const totalCount = overdueReminders.length + upcomingReminders.length;
  const tamilNaduDistricts: string[] = [
  "Ariyalur",
  "Chengalpattu",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kancheepuram",
  "Kanyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivaganga",
  "Tenkasi",
  "Thanjavur",
  "Theni",
  "Thiruvallur",
  "Thiruvarur",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupathur",
  "Tiruppur",
  "Tiruvannamalai",
  "Vellore",
  "Viluppuram",
  "Virudhunagar"
];


  return (
    <header className="bg-gradient-to-r from-blue-400 to-stone-400 shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <h1
              className="text-2xl font-extrabold text-white cursor-pointer tracking-tight hover:text-brown-100 transition-colors"
              onClick={() => setLocation("/")}
            >
              {tFarmPulse}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 text-white hover:bg-brown-600 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6" />
            </Button>
            <Button
              variant="default"
              size="sm"
              className="px-5 py-2 bg-white text-brown-800 font-semibold hover:bg-brown-100 hover:text-brown-900 transition-colors rounded-lg shadow-md"
              onClick={() => setLocation("/")}
            >
              {tHome}
            </Button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
           
            {/* Weather Widget */}
            <div className="flex items-center px-4 py-2 bg-stone-100/10 backdrop-blur-sm rounded-lg shadow-md">
              <svg
                className="w-5 h-5 text-brown-200 mr-2"
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
                <span className="text-sm text-white/80 animate-pulse">Loading...</span>
              ) : weather ? (
                <span className="text-sm text-white font-medium">
                  {weather.temp}°C, {weather.condition}
                </span>
              ) : (
                <span className="text-sm text-red-300">{tWeatherUnavailable}</span>
              )}
<select
  value={location}
  onChange={(e) => setLocationState(e.target.value)}
  className="ml-3 bg-stone-100 border border-brown-300/30 text-black rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brown-300"
>
  {tamilNaduDistricts.sort().map((district) => (
    <option key={district} value={`${district},IN`}>
      {district}
    </option>
  ))}
</select>

            </div>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 text-white hover:bg-brown-600 rounded-full transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-6 h-6" />
                {totalCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-semibold">
                    {totalCount}
                  </span>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg z-50 p-4 border border-gray-200 animate-in fade-in-10 slide-in-from-top-2">
                  <h2 className="font-bold text-lg text-brown-800 mb-3">{tNotifications}</h2>
                  {totalCount === 0 ? (
                    <p className="text-gray-600 text-sm">No upcoming or overdue reminders 🎉</p>
                  ) : (
                    <div className="space-y-4 max-h-72 overflow-y-auto">
                      {upcomingReminders.length > 0 && (
                        <div>
                          <h3 className="text-yellow-600 font-semibold text-sm mb-2">🟡 Upcoming</h3>
                          <ul className="space-y-2">
                            {upcomingReminders.map((rem) => (
                              <li
                                key={rem.id}
                                className="text-sm text-gray-700 bg-yellow-50 p-2 rounded-md"
                              >
                                <strong>{rem.title}</strong> ({rem.type}) on{" "}
                                <span className="text-yellow-700">
                                  {new Date(rem.dueDate).toLocaleString()}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {overdueReminders.length > 0 && (
                        <div>
                          <h3 className="text-red-600 font-semibold text-sm mb-2">🔴 Overdue</h3>
                          <ul className="space-y-2">
                            {overdueReminders.map((rem) => (
                              <li
                                key={rem.id}
                                className="text-sm text-gray-700 bg-red-50 p-2 rounded-md"
                              >
                                <strong>{rem.title}</strong> ({rem.type}) was due on{" "}
                                <span className="text-red-700">
                                  {new Date(rem.dueDate).toLocaleString()}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />
    </header>
  );
}
