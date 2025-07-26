import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Pill, Syringe } from "lucide-react";

interface ReminderCardProps {
  reminder: {
    id: string;
    type: "medicine" | "vaccination";
    title: string;
    animalName?: string;
    dueDate: string;
    isOverdue: boolean;
    description?: string;
  };
  onMarkComplete: (id: string) => void;
  onReschedule: (id: string) => void;
}

export default function ReminderCard({ reminder, onMarkComplete, onReschedule }: ReminderCardProps) {
  const isOverdue = reminder.isOverdue;
  const dueDate = new Date(reminder.dueDate);
  const now = new Date();
  const isToday = dueDate.toDateString() === now.toDateString();
  
  const getCardBorderColor = () => {
    if (isOverdue) return "border-l-destructive bg-red-50";
    if (isToday) return "border-l-accent bg-yellow-50";
    return "border-l-secondary bg-blue-50";
  };

  const getIcon = () => {
    if (reminder.type === "medicine") {
      return <Pill className="w-5 h-5 text-destructive" />;
    }
    return <Syringe className="w-5 h-5 text-secondary" />;
  };

  const formatDueDate = () => {
    if (isOverdue) {
      const daysPast = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return `Overdue by ${daysPast} day${daysPast > 1 ? 's' : ''}`;
    }
    
    if (isToday) {
      return `Today at ${dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return `Due: ${dueDate.toLocaleDateString()} at ${dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <Card className={`border-l-4 ${getCardBorderColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getIcon()}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{reminder.title}</h4>
              {reminder.animalName && (
                <p className="text-sm text-gray-600">{reminder.animalName}</p>
              )}
              {reminder.description && (
                <p className="text-sm text-gray-500 mt-1">{reminder.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Overdue
              </Badge>
            )}
            {isToday && !isOverdue && (
              <Badge className="bg-accent text-accent-foreground text-xs">
                Today
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDueDate()}
          </div>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReschedule(reminder.id)}
            >
              <Clock className="w-3 h-3 mr-1" />
              Reschedule
            </Button>
            <Button
              size="sm"
              className={isOverdue ? "bg-destructive hover:bg-destructive/90" : ""}
              onClick={() => onMarkComplete(reminder.id)}
            >
              Mark Done
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
