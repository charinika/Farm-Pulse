// components/reminders/reminder-card.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Pencil, Trash2, CheckCircle } from "lucide-react";

type Reminder = {
  id: string;
  type: "medicine" | "vaccination";
  title: string;
  dueDate: string;
  isOverdue: boolean;
  animalName?: string;
  description?: string;
};

type ReminderCardProps = {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onDelete: (reminderId: string) => Promise<void>;
  onComplete: (reminder: Reminder) => Promise<void>;
};

export default function ReminderCard({
  reminder,
  onEdit,
  onDelete,
  onComplete,
}: ReminderCardProps) {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this reminder?")) {
      onDelete(reminder.id);
    }
  };

  const handleComplete = () => {
    onComplete(reminder);
  };

  return (
    <Card className="shadow hover:shadow-md transition-all">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {reminder.type.toUpperCase()} REMINDER
          </div>
          {reminder.isOverdue && (
            <span className="text-red-500 text-xs font-semibold">Overdue</span>
          )}
        </div>

        <div className="text-lg font-semibold">{reminder.title}</div>
        <div className="text-sm">Animal: {reminder.animalName || "N/A"}</div>
        <div className="text-sm">Due: {new Date(reminder.dueDate).toLocaleDateString()}</div>

        {reminder.description && (
          <div className="text-sm text-muted-foreground">{reminder.description}</div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(reminder)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleComplete}>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
