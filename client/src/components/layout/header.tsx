import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: overdueReminders = [], isLoading } = useQuery({
    queryKey: ["overdue-reminders"],
    queryFn: async () => {
      const medicine = await apiRequest<any[]>("/api/medicine-reminders/overdue", "GET");
      const vaccination = await apiRequest<any[]>("/api/vaccination-reminders/overdue", "GET");
      return [...(medicine || []), ...(vaccination || [])];
    },
  });

  const overdueCount = overdueReminders.length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="lg:hidden p-2">
              <Menu className="w-6 h-6" />
            </Button>
            <h1 className="ml-4 text-2xl font-semibold text-gray-900">Welcome to the Barn</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Weather Widget */}
            <div className="flex items-center px-3 py-1 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                ></path>
              </svg>
              <span className="text-sm text-blue-700">22°C Partly Cloudy</span>
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
                  {isLoading ? (
                    <p className="text-gray-500 text-sm">Loading...</p>
                  ) : overdueCount === 0 ? (
                    <p className="text-gray-500 text-sm">No overdue reminders 🎉</p>
                  ) : (
                    <ul className="space-y-2 max-h-64 overflow-y-auto">
                      {overdueReminders.map((reminder) => (
                        <li key={reminder.id} className="text-sm text-gray-700">
                          🔔 <strong>{reminder.title}</strong> ({reminder.type}) was due on{" "}
                          <span className="text-red-600">{new Date(reminder.dueDate).toLocaleDateString()}</span>
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
