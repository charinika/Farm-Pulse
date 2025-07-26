import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "primary" | "secondary" | "accent" | "success";
}

export default function MetricsCard({ title, value, icon: Icon, color }: MetricsCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary text-white";
      case "secondary":
        return "bg-secondary text-white";
      case "accent":
        return "bg-accent text-white";
      case "success":
        return "bg-success text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="hover-lift">
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${getColorClasses(color)}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
