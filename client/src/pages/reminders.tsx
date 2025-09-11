import React, { useEffect, useState } from "react";
import ReminderModal from "@/components/reminders/reminder-modal";
import ReminderCard from "@/components/reminders/reminder-card";

export interface Reminder {
  id: number;
  title: string;
  description: string;
  type: "general" | "vaccination" | "medicine";
  dueDate: string;
  isOverdue: boolean;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  // ✅ Load reminders from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("reminders");
    if (stored) {
      setReminders(JSON.parse(stored));
    }
  }, []);

  // ✅ Save reminders whenever they change
  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  const handleAddOrUpdateReminder = (reminder: Reminder) => {
    if (editingReminder) {
      setReminders((prev) =>
        prev.map((r) => (r.id === editingReminder.id ? reminder : r))
      );
      setEditingReminder(null);
    } else {
      setReminders((prev) => [...prev, { ...reminder, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reminders</h1>
      <button
        onClick={() => {
          setEditingReminder(null);
          setIsModalOpen(true);
        }}
        className="px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        + Add Reminder
      </button>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reminders.map((reminder) => (
          <ReminderCard
            key={reminder.id}
            reminder={reminder}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {isModalOpen && (
        <ReminderModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingReminder(null);
          }}
          onSave={handleAddOrUpdateReminder}
          initialData={editingReminder || undefined}
        />
      )}
    </div>
  );
}
