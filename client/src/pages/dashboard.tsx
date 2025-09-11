import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HealthChart from "@/components/dashboard/health-chart";
import RecentActivity from "@/components/dashboard/recent-activity";
import { Bell, Stethoscope, Syringe, TrendingUp, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityLog } from "@/types/activity-log";

// ---------- Types ----------
type Metrics = {
  totalLivestock: number;
  healthyAnimals: number;
  pendingReminders: number;
  monthlyExpenses: number;
};

// The UI expects these normalized fields
type Reminder = {
  id: string;
  medicineName: string;
  nextDueDate: string;
};

// ---------- Helpers ----------
const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
};

export default function Dashboard() {
  // Metrics
  const { data: metrics, isLoading: isLoadingMetrics } = useQuery<Metrics>({
    queryKey: ["/api/dashboard/metrics"],
    queryFn: ({ queryKey }) => fetcher<Metrics>(queryKey[0] as string),
    refetchOnWindowFocus: false,
    staleTime: 10_000,
  });

  // Activity Logs
  const {
    data: activityLogsData,
    isLoading: isLoadingActivity,
  } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activity-logs"],
    queryFn: ({ queryKey }) => fetcher<ActivityLog[]>(queryKey[0] as string),
    refetchOnWindowFocus: false,
    staleTime: 10_000,
  });

  // Overdue Reminders (raw shape may vary -> normalize)
  const { data: overdueRaw } = useQuery<Record<string, any>[]>({
    queryKey: ["/api/medicine-reminders/overdue"],
    queryFn: ({ queryKey }) => fetcher<Record<string, any>[]>(queryKey[0] as string),
    refetchOnWindowFocus: false,
    staleTime: 10_000,
  });

  const safeMetrics: Metrics = metrics ?? {
    totalLivestock: 0,
    healthyAnimals: 0,
    pendingReminders: 0,
    monthlyExpenses: 0,
  };

  const safeActivityLogs: ActivityLog[] = activityLogsData ?? [];

  // Normalize reminders to what the UI expects
  const safeOverdueReminders: Reminder[] = (overdueRaw ?? []).map((r) => ({
    id: String(r.id ?? r.reminder_id ?? r.livestock_id ?? Math.random()),
    medicineName: r.medicine ?? r.medicine_name ?? r.vaccine ?? r.title ?? "Medicine",
    nextDueDate: r.nextDueDate ?? r.due_date ?? r.schedule ?? "",
  }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Livestock</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingMetrics ? (
              <Skeleton className="h-6 w-10" />
            ) : (
              <div className="text-2xl font-bold">{safeMetrics.totalLivestock}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Animals</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingMetrics ? (
              <Skeleton className="h-6 w-10" />
            ) : (
              <div className="text-2xl font-bold">{safeMetrics.healthyAnimals}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reminders</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingMetrics ? (
              <Skeleton className="h-6 w-10" />
            ) : (
              <div className="text-2xl font-bold">{safeMetrics.pendingReminders}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingMetrics ? (
              <Skeleton className="h-6 w-10" />
            ) : (
              <div className="text-2xl font-bold">₹{safeMetrics.monthlyExpenses}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthChart metrics={safeMetrics} />
        <RecentActivity activities={safeActivityLogs} isLoading={isLoadingActivity} />
      </div>

      {/* Overdue Reminders */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Overdue Medicine Reminders</h2>
        {safeOverdueReminders.length === 0 ? (
          <p className="text-muted-foreground">No overdue reminders 🎉</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeOverdueReminders.slice(0, 3).map((reminder, idx) => (
              <Card key={`${reminder.id}-${idx}`}>
                <CardHeader>
                  <CardTitle className="text-base">{reminder.medicineName}</CardTitle>
                  <CardDescription>
                    Due on:{" "}
                    <span className="font-medium text-red-600">{reminder.nextDueDate}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Syringe className="h-4 w-4 mr-2" />
                    Medicine Reminder
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
