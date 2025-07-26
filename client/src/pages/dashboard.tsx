import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import MetricsCard from "@/components/dashboard/metrics-card";
import HealthChart from "@/components/dashboard/health-chart";
import RecentActivity from "@/components/dashboard/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Heart, Clock, DollarSign } from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();

  const { data: metrics, isLoading: isLoadingMetrics, error: metricsError } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: activityLogs, isLoading: isLoadingActivity, error: activityError } = useQuery({
    queryKey: ["/api/activity-logs"],
  });

  const { data: overdueReminders, error: remindersError } = useQuery({
    queryKey: ["/api/medicine-reminders/overdue"],
  });

  // Default values for type safety
  const safeMetrics = metrics || { totalLivestock: 0, healthyAnimals: 0, pendingReminders: 0, monthlyExpenses: 0 };
  const safeActivityLogs = activityLogs || [];
  const safeOverdueReminders = overdueReminders || [];

  // Handle unauthorized errors
  useEffect(() => {
    const errors = [metricsError, activityError, remindersError].filter(Boolean);
    for (const error of errors) {
      if (error && isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    }
  }, [metricsError, activityError, remindersError, toast]);

  if (isLoadingMetrics) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900">Farm Dashboard</h1>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-lg shadow-sm animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Farm Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Weather Widget */}
            <div className="flex items-center px-3 py-1 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
              </svg>
              <span className="text-sm text-blue-700">22°C Partly Cloudy</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricsCard
            title="Total Livestock"
            value={safeMetrics.totalLivestock}
            icon={Users}
            color="primary"
          />
          <MetricsCard
            title="Healthy Animals"
            value={safeMetrics.healthyAnimals}
            icon={Heart}
            color="success"
          />
          <MetricsCard
            title="Pending Reminders"
            value={safeMetrics.pendingReminders}
            icon={Clock}
            color="accent"
          />
          <MetricsCard
            title="Monthly Expenses"
            value={`$${safeMetrics.monthlyExpenses}`}
            icon={DollarSign}
            color="secondary"
          />
        </div>

        {/* Charts and Recent Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Health Status Chart */}
          <div className="lg:col-span-2">
            <HealthChart metrics={safeMetrics} />
          </div>

          {/* Recent Activity */}
          <div>
            <RecentActivity
              activities={safeActivityLogs}
              isLoading={isLoadingActivity}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Urgent Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <Clock className="w-5 h-5 text-destructive mr-2" />
                Urgent Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {safeOverdueReminders.length > 0 ? (
                <div className="space-y-3">
                  {safeOverdueReminders.slice(0, 3).map((reminder: any) => (
                    <div key={reminder.id} className="flex items-center p-3 bg-red-50 rounded-lg border-l-4 border-destructive">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {reminder.medicineName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(reminder.nextDueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" variant="destructive">
                        Mark Done
                      </Button>
                    </div>
                  ))}
                  {overdueReminders.length > 3 && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/reminders">View All Reminders</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Heart className="w-12 h-12 text-success mx-auto mb-3" />
                  <p className="text-gray-500">All reminders are up to date!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link href="/livestock">
                    <Users className="w-4 h-4 mr-2" />
                    Add New Animal
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/health-records">
                    <Heart className="w-4 h-4 mr-2" />
                    Record Health Event
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/reminders">
                    <Clock className="w-4 h-4 mr-2" />
                    Set Reminder
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/disease-diagnosis">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                    Disease Diagnosis
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
