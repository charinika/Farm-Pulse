import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductivityRecord {
  id: string;
  animalId: string;
  date: string;
  type: string;
  quantity: number;
  notes?: string;
}

interface ProductivityModalProps {
  open: boolean;
  onClose: () => void;
  animalId: string;
}

function groupBy(records: ProductivityRecord[], mode: string) {
  const grouped: { [key: string]: number } = {};

  for (const rec of records) {
    const date = new Date(rec.date);
    let key = "";

    if (mode === "weekly") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toLocaleDateString();
    } else if (mode === "monthly") {
      key = `${date.getMonth() + 1}/${date.getFullYear()}`;
    } else {
      key = date.toLocaleDateString();
    }

    grouped[key] = (grouped[key] || 0) + rec.quantity;
  }

  return Object.entries(grouped).map(([key, value]) => ({ date: key, quantity: value }));
}

export default function ProductivityModal({ open, onClose, animalId }: ProductivityModalProps) {
  const [records, setRecords] = useState<ProductivityRecord[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<string>("daily");
  const [search, setSearch] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [editingRecord, setEditingRecord] = useState<ProductivityRecord | null>(null);

  useEffect(() => {
    if (open && animalId) {
      fetch(`/api/productivity/animal/${animalId}`)
        .then((res) => res.json())
        .then((data) => setRecords(data))
        .catch((err) => console.error("❌ Fetch failed:", err));
    }
  }, [open, animalId]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/productivity/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRecords((prev) => prev.filter((rec) => rec.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  const handleEdit = (record: ProductivityRecord) => {
    const updatedNote = prompt("Edit note:", record.notes || "");
    if (updatedNote !== null) {
      const updated = { ...record, notes: updatedNote };
      fetch(`/api/productivity/${record.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      })
        .then((res) => res.json())
        .then((updatedRec) => {
          setRecords((prev) => prev.map((rec) => (rec.id === updatedRec.id ? updatedRec : rec)));
        })
        .catch((err) => console.error("Update failed:", err));
    }
  };

  const filteredRecords = records.filter((rec) => {
    const matchesFilter = filter === "all" || rec.type === filter;
    const matchesSearch =
      rec.notes?.toLowerCase().includes(search.toLowerCase()) ||
      new Date(rec.date).toLocaleDateString().includes(search);
    const matchesStart = startDate ? new Date(rec.date) >= new Date(startDate) : true;
    const matchesEnd = endDate ? new Date(rec.date) <= new Date(endDate) : true;
    return matchesFilter && matchesSearch && matchesStart && matchesEnd;
  });

  const chartData = groupBy(filteredRecords, viewMode);

  const averageYield =
    filteredRecords.length > 0
      ? (
          filteredRecords.reduce((sum, rec) => sum + rec.quantity, 0) /
          filteredRecords.length
        ).toFixed(2)
      : "0";

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Productivity Report", 14, 16);
    autoTable(doc, {
      head: [["Date", "Type", "Quantity", "Notes"]],
      body: filteredRecords.map((rec) => [
        new Date(rec.date).toLocaleDateString(),
        rec.type,
        rec.quantity.toString(),
        rec.notes || "-",
      ]),
    });
    doc.save("productivity-report.pdf");
  };

  const uniqueTypes = Array.from(new Set(records.map((rec) => rec.type)));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>📊 Productivity Overview</DialogTitle>
        </DialogHeader>

        {records.length === 0 ? (
          <p className="text-gray-500 text-sm">No productivity records found.</p>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 justify-between items-center">
              <select
                className="border rounded px-3 py-1 text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                className="border rounded px-3 py-1 text-sm"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              <Input
                type="text"
                placeholder="🔍 Search by note or date"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />

              <div className="flex gap-2 items-center">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-sm"
                />
                <span className="text-sm">to</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-sm"
                />
              </div>

              <Button size="sm" onClick={exportToPDF} className="bg-blue-600 hover:bg-blue-700 text-white">
                ⬇️ Export PDF
              </Button>
            </div>

            <p className="text-sm text-gray-700">Average Yield: {averageYield}</p>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <XAxis dataKey="date" fontSize={12} angle={-45} textAnchor="end" height={60} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {filteredRecords.map((rec) => (
                <div key={rec.id} className="border p-2 rounded bg-gray-50 relative">
                  <p className="text-sm font-medium">📅 {new Date(rec.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Type: {rec.type}</p>
                  <p className="text-sm text-gray-600">Quantity: {rec.quantity}</p>
                  {rec.notes && <p className="text-xs text-gray-500 italic">Note: {rec.notes}</p>}

                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button size="icon" variant="ghost" className="text-gray-500 hover:text-blue-600" onClick={() => handleEdit(rec)}>
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-gray-500 hover:text-red-600"
                      onClick={() => handleDelete(rec.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
