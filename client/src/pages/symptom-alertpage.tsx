import { useState, useEffect } from "react";
import { Input, Button } from "@/components/ui";

type SymptomEntry = {
  id: number;
  animal_id: string;
  symptoms: string[];
  predicted_disease: string;
  risk_level: string;
  action: string;
  timestamp: string;
};

type Prediction = {
  disease: string;
  risk: string;
  action: string;
  score?: number;
};

export default function SymptomAlertPage() {
  const [animalId, setAnimalId] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [history, setHistory] = useState<SymptomEntry[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const symptomOptions = [
    "cough", "loss of appetite", "fever", "diarrhea", "lameness",
    "swelling", "milk drop", "udder swelling", "abortion", "bloating",
    "nasal discharge", "dehydration", "weak calves", "abdominal pain",
    "drooling", "blisters in mouth", "weakness", "pale gums", "rough coat"
  ];

  useEffect(() => {
    if (animalId) fetchHistory();
  }, [animalId]);

  const handleSubmit = async () => {
    if (!animalId || symptoms.length === 0) {
      alert("Please enter animal ID and select at least one symptom");
      return;
    }

    setPredictions([]); // clear previous predictions

    try {
      const res = await fetch(`${BASE_URL}/api/symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animal_id: animalId, symptoms }),
      });

      const data = await res.json();

      if (data.success) {
        setPredictions(data.predictions);
        setSymptoms([]);
        fetchHistory();
      } else {
        alert("Error submitting symptoms: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error connecting to backend:", err);
      alert("Failed to connect to backend");
    }
  };

  const fetchHistory = async () => {
    if (!animalId) return;
    try {
      const res = await fetch(`${BASE_URL}/api/symptoms?animal_id=${animalId}`);
      const data = await res.json();
      if (data.success) setHistory(data.history);
      else alert("Failed to fetch history");
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const topPrediction = predictions.length > 0 ? predictions[0] : null;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Symptom-Based Alerts</h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Animal ID:</label>
        <Input
          type="text"
          value={animalId}
          onChange={(e) => setAnimalId(e.target.value)}
          placeholder="Enter animal ID"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Symptoms:</label>
        <div className="flex flex-wrap gap-2">
          {symptomOptions.map(s => (
            <button
              key={s}
              className={`px-3 py-1 border rounded cursor-pointer transition ${
                symptoms.includes(s)
                  ? "bg-green-500 text-white border-green-700"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
              onClick={() =>
                setSymptoms(prev =>
                  prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                )
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <Button onClick={handleSubmit} className="mr-2">Submit Symptoms</Button>
        
      </div>

      {/* Top Prediction */}
      {topPrediction && (
        <div className="mb-6 p-4 border-l-4 border-green-500 bg-green-50 rounded shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Most Probable Disease</h2>
          <p><strong>Disease:</strong> {topPrediction.disease}</p>
          <p><strong>Risk:</strong> {topPrediction.risk}</p>
          <p><strong>Action:</strong> {topPrediction.action}</p>
        </div>
      )}

      {/* All Predictions */}
      {predictions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">All Predicted Diseases</h2>
          <div className="flex flex-wrap gap-4">
            {predictions.map((p, i) => (
              <div key={i} className="p-4 border rounded shadow-sm w-64 bg-white">
                <p><strong>Disease:</strong> {p.disease}</p>
                <p><strong>Risk:</strong> {p.risk}</p>
                <p><strong>Action:</strong> {p.action}</p>
                <p className="text-gray-400 text-sm">Score: {p.score}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">History</h2>
        {history.length === 0 && animalId && (
          <p className="text-gray-500 mt-2">No symptom history for this animal.</p>
        )}
        {history.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 bg-white rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Symptoms</th>
                  <th className="border px-2 py-1">Predicted Disease</th>
                  <th className="border px-2 py-1">Risk</th>
                  <th className="border px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map(entry => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{new Date(entry.timestamp).toLocaleString()}</td>
                    <td className="border px-2 py-1">{entry.symptoms.join(", ")}</td>
                    <td className="border px-2 py-1">{entry.predicted_disease}</td>
                    <td className="border px-2 py-1">{entry.risk_level}</td>
                    <td className="border px-2 py-1">{entry.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
