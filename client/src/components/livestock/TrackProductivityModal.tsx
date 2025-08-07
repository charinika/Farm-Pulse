import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    date: string;
    type: string;
    quantity: number;
    notes?: string;
  }) => void;
  animal: {
    id: number;
    type: string;
  };
}

export default function TrackProductivityModal({ open, onClose, onSave, animal }: Props) {
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!date || !type || isNaN(parseFloat(quantity))) {
      setError("Please fill all required fields correctly.");
      return;
    }

    const newRecord = {
      date,
      type,
      quantity: parseFloat(quantity),
      notes,
    };

    try {
      await axios.post("/api/productivity", {
        animalId: animal.id,
        ...newRecord,
      });

      const key = `productivity-${animal.id}`;
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      stored.push({ animalId: animal.id, ...newRecord });
      localStorage.setItem(key, JSON.stringify(stored));

      setError(""); // clear any previous error
      onSave(newRecord);
      onClose();
    } catch (err) {
      console.error("Failed to save to backend:", err);
      setError("Something went wrong while saving.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Track Productivity for {animal.type}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Type (e.g., Milk, Eggs)</Label>
            <Input value={type} onChange={(e) => setType(e.target.value)} />
          </div>
          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
