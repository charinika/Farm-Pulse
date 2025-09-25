export interface Reminder {
  id: number;
  title: string;
  description: string;
  type: "general" | "vaccination" | "medicine";
  dueDate: string;
  isOverdue: boolean;
}
