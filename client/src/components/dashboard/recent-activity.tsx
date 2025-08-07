import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Plus } from "lucide-react";


interface ActivityLog {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  livestock?: {
    name: string;
    species: string;
  };
}

interface RecentActivityProps {
  activities: ActivityLog[];
  isLoading: boolean;
}

export default function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case "vaccination_completed":
      case "health_record_added":
        return <CheckCircle className="w-4 h-4 text-white" />;
      case "medicine_reminder":
        return <Clock className="w-4 h-4 text-white" />;
      case "animal_added":
        return <Plus className="w-4 h-4 text-white" />;
      default:
        return <CheckCircle className="w-4 h-4 text-white" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case "vaccination_completed":
      case "health_record_added":
        return "bg-success";
      case "medicine_reminder":
        return "bg-accent";
      case "animal_added":
        return "bg-primary";
      default:
        return "bg-gray-500";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities && activities.length > 0 ? (
          <div className="flow-root">
            <ul className="-mb-8">
              {activities.map((activity, index) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index !== activities.length - 1 && (
                      <div className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></div>
                    )}
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className={`h-8 w-8 rounded-full ring-8 ring-white flex items-center justify-center ${getActivityColor(activity.action)}`}>
                          {getActivityIcon(activity.action)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">
                              {activity.description}
                            </span>
                          </div>
                          {activity.livestock && (
                            <p className="mt-0.5 text-sm text-gray-500">
                              {activity.livestock.species} - {activity.livestock.name}
                            </p>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <time>{formatTimeAgo(activity.createdAt)}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-gray-500">
              <div className="text-4xl mb-2">📝</div>
              <p>No recent activity</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
