import React from "react";
import { Reminder } from "@/pages/reminders";

interface Props {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: number) => void;
}

export default function ReminderCard({ reminder, onEdit, onDelete }: Props) {
  const dueDate = new Date(reminder.dueDate);
  const isOverdue = dueDate < new Date() && !reminder.isOverdue;

  return (
    <div
      className={`p-4 rounded-lg shadow-md border ${
        isOverdue ? "bg-red-100 border-red-400" : "bg-white border-gray-200"
      }`}
    >
      <h2 className="text-lg font-semibold">{reminder.title}</h2>
      <p className="text-sm text-gray-600">{reminder.description}</p>
      <p className="text-xs mt-2">
        <span className="font-semibold">Type:</span> {reminder.type}
      </p>
      <p
        className={`text-xs mt-1 ${
          isOverdue ? "text-red-600 font-bold" : "text-gray-600"
        }`}
      >
        Due: {dueDate.toLocaleDateString()}
      </p>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onEdit(reminder)}
          className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(reminder.id)}
          className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
