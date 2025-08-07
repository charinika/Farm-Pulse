// components/reminders/reminder-card.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

type Reminder = {
  id: string;
  type: "medicine" | "vaccination";
  title: string;
  animalName?: string;
  dueDate: string;
  isOverdue: boolean;
  description?: string;
};

type ReminderCardProps = {
  reminder: Reminder;
  onMarkComplete: () => void;
  onReschedule: (newDate: string) => void;
};

// ✅ Fix: Explicitly declare props type
export default function ReminderCard({
  reminder,
  onMarkComplete,
  onReschedule,
}: ReminderCardProps) {
  return (
    <Card className="mb-4 shadow">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {reminder.type.toUpperCase()} REMINDER
          </div>
          <div className="text-lg font-semibold">{reminder.title}</div>
          <div className="text-sm">For: {reminder.animalName || "Unknown animal"}</div>
          <div className="text-sm">Due: {new Date(reminder.dueDate).toLocaleDateString()}</div>
          {reminder.description && (
            <div className="text-sm text-muted-foreground mt-1">{reminder.description}</div>
          )}
          {reminder.isOverdue && (
            <Badge variant="destructive" className="mt-2">Overdue</Badge>
          )}
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Button variant="outline" onClick={onMarkComplete}>Mark Complete</Button>
          <Button
            variant="ghost"
            onClick={() => {
              const newDate = prompt("Enter new due date (YYYY-MM-DD):");
              if (newDate) onReschedule(newDate);
            }}
          >
            Reschedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
