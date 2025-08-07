import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import html2canvas from "html2canvas";

interface Props {
  open: boolean;
  onClose: () => void;
  animal: {
    id: number;
    name: string;
    type: string;
  };
}

export default function ViewProductivityModal({ open, onClose, animal }: Props) {
  const [records, setRecords] = useState<
    { date: string; quantity: number; type: string }[]
  >([]);
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animal && animal.id) {
      const key = `productivity-${animal.id}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecords(parsed);
      } else {
        setRecords([]);
      }
    }
  }, [animal]);

  const handleDownload = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = `${animal.name}-productivity-chart.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Productivity History for {animal.name} ({animal.type})
          </DialogTitle>
        </DialogHeader>

        {records.length === 0 ? (
          <p className="text-sm text-gray-500">No productivity data available.</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-muted-foreground">Date vs Quantity</Label>
              <div className="flex gap-2">
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  onClick={() => setChartType("line")}
                >
                  Line Chart
                </Button>
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  onClick={() => setChartType("bar")}
                >
                  Bar Chart
                </Button>
                <Button onClick={handleDownload} variant="secondary">
                  Download Chart
                </Button>
              </div>
            </div>

            <div ref={chartRef} className="bg-white p-4 rounded shadow">
              <ResponsiveContainer width="100%" height={300}>
                {chartType === "line" ? (
                  <LineChart data={records}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="quantity"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={records}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#34d399" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
