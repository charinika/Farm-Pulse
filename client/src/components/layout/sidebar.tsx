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
  { name: "AI Assistant", href: "/chatbot", icon: Bot },
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
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-primary">
          <h1 className="text-xl font-bold text-white">🚜 FarmCare Pro</h1>
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
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <img 
              className="w-8 h-8 rounded-full object-cover" 
              src={user?.profileImageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"} 
              alt="Profile picture" 
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.firstName || user?.email?.split('@')[0] || "Farm Manager"}
              </p>
              <p className="text-xs text-gray-500">Farm Manager</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
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