import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Bell, 
  Stethoscope, 
  AlertTriangle, 
  MessageSquare,
  Bot,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Livestock Profiles", href: "/livestock", icon: Users },
  { name: "Health Records", href: "/health-records", icon: FileText },
  { name: "Reminders", href: "/reminders", icon: Bell },
  { name: "Disease Diagnosis", href: "/disease-diagnosis", icon: Stethoscope },
  { name: "Emergency Protocols", href: "/emergency-protocols", icon: AlertTriangle },
  { name: "Community Forum", href: "/community-forum", icon: MessageSquare },
  { name: "Chatbot Assistant", href: "/chatbot", icon: Bot },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const { data: livestock } = useQuery({
    queryKey: ["/api/livestock"],
  });

  const { data: overdueReminders } = useQuery({
    queryKey: ["/api/medicine-reminders/overdue"],
  });

  const safeLivestock = Array.isArray(livestock) ? livestock : [];
  const safeOverdueReminders = Array.isArray(overdueReminders) ? overdueReminders : [];
  const livestockCount = safeLivestock.length;
  const overdueCount = safeOverdueReminders.length;

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 bg-green-100 border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-primary">
          <h1 className="text-xl font-bold text-white">Farm Pulse</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <a className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md group",
                  isActive
                    ? "text-white bg-primary"
                    : "text-gray-700 hover:bg-green-200 hover:text-gray-900"
                )}>
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                  {item.name === "Livestock Profiles" && livestockCount > 0 && (
                    <span className="ml-auto bg-primary text-white text-xs rounded-full px-2 py-1">
                      {livestockCount}
                    </span>
                  )}
                  {item.name === "Reminders" && overdueCount > 0 && (
                    <span className="ml-auto bg-destructive text-white text-xs rounded-full px-2 py-1 notification-badge">
                      {overdueCount}
                    </span>
                  )}
                </a>
              </Link>
            );
          })}
        </nav>
        
        {/* User Profile */}
        <div className="flex-shrink-0 p-4 border-t border-green-200 bg-gray-100">
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-800">
              {user?.username || "Farm Owner"}
            </p>
            <p className="text-xs text-gray-500">Farm Manager</p>
          </div>
          <Button
            className="w-full bg-red-200 text-black hover:bg-yellow-100 transition-colors duration-200"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {logoutMutation.isPending ? "Signing Out..." : "Sign Out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
