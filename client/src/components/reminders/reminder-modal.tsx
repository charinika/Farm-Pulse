import React, { useState } from "react";
import { Reminder } from "@/pages/reminders";

interface Props {
  onClose: () => void;
  onSave: (reminder: Reminder) => void;
  initialData?: Reminder;
}

export default function ReminderModal({ onClose, onSave, initialData }: Props) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [type, setType] = useState<"general" | "vaccination" | "medicine">(
    initialData?.type || "general"
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate || new Date().toISOString().split("T")[0]
  );

  const handleSubmit = () => {
    const reminder: Reminder = {
      id: initialData?.id || Date.now(),
      title,
      description,
      type,
      dueDate,
      isOverdue: new Date(dueDate) < new Date(),
    };
    onSave(reminder);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Reminder" : "Add Reminder"}
        </h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />
        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value as "general" | "vaccination" | "medicine")
          }
          className="w-full border p-2 mb-2 rounded"
        >
          <option value="general">General</option>
          <option value="vaccination">Vaccination</option>
          <option value="medicine">Medicine</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
