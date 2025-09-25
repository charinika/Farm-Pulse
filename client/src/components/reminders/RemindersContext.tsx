// client/src/components/reminders/RemindersContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Reminder } from "@/types/reminder";

interface RemindersContextType {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, "id">) => void;
  updateReminder: (reminder: Reminder) => void;
  deleteReminder: (id: number) => void;
}

const RemindersContext = createContext<RemindersContextType | undefined>(undefined);

export const RemindersProvider = ({ children }: { children: ReactNode }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("reminders");
    if (stored) {
      setReminders(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever reminders change
  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = (reminder: Omit<Reminder, "id">) => {
    setReminders((prev) => [
      ...prev,
      {
        ...reminder,
        id: Date.now(), // unique ID
      },
    ]);
  };

  const updateReminder = (updated: Reminder) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  const deleteReminder = (id: number) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <RemindersContext.Provider
      value={{ reminders, addReminder, updateReminder, deleteReminder }}
    >
      {children}
    </RemindersContext.Provider>
  );
};

// Custom hook for easy access
export const useReminders = () => {
  const context = useContext(RemindersContext);
  if (!context) {
    throw new Error("useReminders must be used within a RemindersProvider");
  }
  return context;
};
