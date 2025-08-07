import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Livestock {
  id: string;
  name: string;
}

interface ReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  livestock: Livestock[];
}

export default function ReminderModal({ open, onOpenChange, onSave, livestock }: ReminderModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [livestockId, setLivestockId] = useState("");

  const handleSubmit = async () => {
    if (!title || !dueDate) return;

    const res = await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, dueDate, livestockId }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      setDueDate("");
      setLivestockId("");
      onSave();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Reminder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Due Date</Label>
            <Input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <Label>Livestock</Label>
            <select
              value={livestockId}
              onChange={(e) => setLivestockId(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">None</option>
              {livestock.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
