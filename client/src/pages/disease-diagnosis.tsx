import { useState, useRef } from "react";
import jsPDF from "jspdf";
import {
  Input,
  Card,
  Button,
} from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Trash2,
  Loader2,
  UploadCloud,
  Download,
  Moon,
  Sun,
} from "lucide-react";

interface PredictionResult {
  prediction?: string;
  treatment?: string[];
  firstAid?: string[];
  prevention?: string[];
  file: File;
  error?: boolean;
  message?: string;
}

export default function DiseaseDiagnosis() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedToClear, setSelectedToClear] = useState<Set<number>>(new Set());

  const dropRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
    setPredictions([]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith("image/")
    );
    setSelectedImages(prev => [...prev, ...files]);
    setPredictions([]);
  };

  const handleImageUpload = async () => {
    if (selectedImages.length === 0) return;
    setUploading(true);
    const results: PredictionResult[] = [];

    for (const image of selectedImages) {
      const formData = new FormData();
      formData.append("file", image);

      try {
        const res = await fetch("/api/diagnosis/predict", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Prediction failed");
        const data = await res.json();
        results.push({ ...data, file: image });
      } catch {
        results.push({ error: true, message: "Failed to analyze", file: image });
      }
    }

    setPredictions(results);
    setUploading(false);
  };

  const handleClearSelected = () => {
    setSelectedImages(prev => prev.filter((_, idx) => !selectedToClear.has(idx)));
    setPredictions(prev => prev.filter((_, idx) => !selectedToClear.has(idx)));
    setSelectedToClear(new Set());
  };

  const handleClearAll = () => {
    setSelectedImages([]);
    setPredictions([]);
    setSelectedToClear(new Set());
  };

  const toggleCheckbox = (index: number) => {
    setSelectedToClear(prev => {
      const updated = new Set(prev);
      updated.has(index) ? updated.delete(index) : updated.add(index);
      return updated;
    });
  };

  const downloadPDF = (result: PredictionResult, index: number) => {
    const doc = new jsPDF();
    doc.setFontSize(18).text("Farm Pulse AI Disease Diagnosis", 10, 20);
    doc.setFontSize(12).text(`Prediction Report #${index + 1}`, 10, 30);
    doc.text(`File: ${result.file?.name || "Unknown"}`, 10, 40);

    if (result.error) {
      doc.setTextColor(200, 0, 0).text(`❌ ${result.message}`, 10, 50);
    } else {
      doc.setTextColor(0, 0, 0);
      doc.text(`✅ Prediction: ${result.prediction}`, 10, 50);
      doc.text(`💊 Treatment: ${result.treatment?.join(", ") || "N/A"}`, 10, 60);
      doc.text(`🧯 First Aid: ${result.firstAid?.join(", ") || "N/A"}`, 10, 70);
      doc.text(`🛡️ Prevention: ${result.prevention?.join(", ") || "N/A"}`, 10, 80);
    }

    doc.save(`prediction-${index + 1}.pdf`);
  };

  return (
    <div
      className={`relative p-6 min-h-screen max-w-6xl mx-auto transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-center text-green-700 w-full">
            🐄 AI-Powered Livestock Disease Diagnosis
          </h2>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {darkMode ? <Sun /> : <Moon />}
          </Button>
        </div>

        <div
          ref={dropRef}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-dashed border-2 p-8 rounded-xl text-center cursor-pointer transition-all duration-300 shadow-md ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-green-400"
          }`}
          onClick={() => dropRef.current?.querySelector("input")?.click()}
        >
          <UploadCloud className="mx-auto mb-3 text-green-600" size={40} />
          <p className="mb-2 font-medium">Drag & drop images here or click to browse</p>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {selectedImages.length > 0 && (
          <>
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              {selectedImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview-${idx}`}
                    className="w-32 h-32 object-cover rounded-lg border shadow hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-1 left-1">
                    <Checkbox
                      checked={selectedToClear.has(idx)}
                      onCheckedChange={() => toggleCheckbox(idx)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-3 justify-center">
              <Button
                onClick={handleImageUpload}
                disabled={uploading}
                className="flex items-center px-5"
              >
                {uploading ? <Loader2 className="animate-spin mr-2" /> : <Search className="mr-2" />}
                Diagnose
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearSelected}
                className="flex items-center px-5"
              >
                <Trash2 className="mr-2" />
                Clear Selected
              </Button>
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="flex items-center px-5"
              >
                <Trash2 className="mr-2" />
                Clear All
              </Button>
            </div>
          </>
        )}

        <div className="mt-10 space-y-6">
          {predictions.map((result, index) => (
            <Card key={index} className="border border-green-300 rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <img
                  src={URL.createObjectURL(result.file)}
                  alt={`predicted-${index}`}
                  className="w-40 h-40 object-cover rounded-md border shadow"
                />
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-green-800">
                        Prediction #{index + 1}: {result.file?.name}
                      </h3>
                      {result.error ? (
                        <p className="text-red-600 mt-1 font-medium">❌ {result.message}</p>
                      ) : (
                        <p className="mt-1">✅ Disease: <strong>{result.prediction}</strong></p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={selectedToClear.has(index)} onCheckedChange={() => toggleCheckbox(index)} />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadPDF(result, index)}
                        className="text-xs"
                      >
                        <Download className="mr-1 h-4 w-4" /> Download
                      </Button>
                    </div>
                  </div>

                  {!result.error && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                      <div className="p-4 rounded-lg bg-green-50 border border-green-200 shadow">
                        <h4 className="font-semibold mb-1 text-green-800">💊 Treatment</h4>
                        <p>{result.treatment?.join(", ") || "N/A"}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 shadow">
                        <h4 className="font-semibold mb-1 text-yellow-800">🧯 First Aid</h4>
                        <p>{result.firstAid?.join(", ") || "N/A"}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 shadow">
                        <h4 className="font-semibold mb-1 text-blue-800">🛡️ Prevention</h4>
                        <p>{result.prevention?.join(", ") || "N/A"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
