import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface HealthChartProps {
  metrics?: {
    totalLivestock: number;
    healthyAnimals: number;
    pendingReminders: number;
    monthlyExpenses: number;
  };
}

export default function HealthChart({ metrics }: HealthChartProps) {
  const total = metrics?.totalLivestock || 0;
  const healthy = metrics?.healthyAnimals || 0;
  const treatment = Math.max(0, total - healthy - 1); // Rough estimate
  const monitoring = Math.max(0, total - healthy - treatment);

  const healthyPercent = total > 0 ? Math.round((healthy / total) * 100) : 0;
  const treatmentPercent = total > 0 ? Math.round((treatment / total) * 100) : 0;
  const monitoringPercent = total > 0 ? Math.round((monitoring / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">
          Livestock Health Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container rounded-lg p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{healthyPercent}%</div>
              <div className="text-sm opacity-90">Healthy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{treatmentPercent}%</div>
              <div className="text-sm opacity-90">Treatment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{monitoringPercent}%</div>
              <div className="text-sm opacity-90">Monitoring</div>
            </div>
          </div>
          
          {/* Mock Chart Visualization */}
          <div className="flex items-end space-x-2 h-32">
            {[85, 60, 90, 45, 75, 95, 55].map((height, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-30 rounded-t w-8"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
