import React, { useState } from "react";
import ReminderModal from "@/components/reminders/reminder-modal";
import ReminderCard from "@/components/reminders/reminder-card";
import { useReminders } from "@/components/reminders/RemindersContext"; // ✅ import context
import { Reminder } from "@/types/reminder";
import { useTranslatedText } from "@/hooks/useTranslatedText";

export default function RemindersPage() {
  const { reminders, addReminder, updateReminder, deleteReminder } = useReminders(); // ✅ use context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const handleAddOrUpdateReminder = (reminder: Reminder) => {
    if (editingReminder) {
      updateReminder({ ...reminder, id: editingReminder.id }); // ✅ context update
      setEditingReminder(null);
    } else {
      addReminder(reminder); // ✅ context add
    }
    setIsModalOpen(false);
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteReminder(id); // ✅ context delete
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
        {reminders.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">
            No reminders yet. Click "Add Reminder" to create one.
          </p>
        ) : (
          reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
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
