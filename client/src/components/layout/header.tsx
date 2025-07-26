import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
  const { data: overdueReminders } = useQuery({
    queryKey: ["/api/medicine-reminders/overdue"],
  });

  const safeOverdueReminders = overdueReminders || [];
  const overdueCount = safeOverdueReminders.length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="lg:hidden p-2">
              <Menu className="w-6 h-6" />
            </Button>
            <h1 className="ml-4 text-2xl font-semibold text-gray-900">Farm Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Weather Widget */}
            <div className="flex items-center px-3 py-1 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
              </svg>
              <span className="text-sm text-blue-700">22°C Partly Cloudy</span>
            </div>
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="w-6 h-6" />
              {overdueCount > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-destructive"></span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
