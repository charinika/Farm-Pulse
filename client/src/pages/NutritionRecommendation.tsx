import { useState } from "react";

type HealthOption =
  | "None"
  | "Digestive"
  | "Milk Fever"
  | "Parasite"
  | "Weak"
  | "Other";

type GenderOption = "Male" | "Female";
type StageOption = "Calf" | "Growing" | "Lactating" | "Dry";

const breeds = ["Holstein", "Jersey", "Gir", "Sahiwal", "Crossbreed"];
const genders: GenderOption[] = ["Male", "Female"];
const stages: StageOption[] = ["Calf", "Growing", "Lactating", "Dry"];
const healthIssues: HealthOption[] = ["None", "Digestive", "Milk Fever", "Parasite", "Weak", "Other"];

export default function NutritionRecommendation() {
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [gender, setGender] = useState<GenderOption | "">("");
  const [stage, setStage] = useState<StageOption | "">("");
  const [milkYield, setMilkYield] = useState<number | "">("");
  const [health, setHealth] = useState<HealthOption>("None");
  const [recommendation, setRecommendation] = useState("");
  const [protein, setProtein] = useState(0);
  const [energy, setEnergy] = useState<"low" | "moderate" | "high" | "easily digestible">("moderate");
  const [loading, setLoading] = useState(false);

  const getNutritionRecommendation = async () => {
    if (!breed || !age || !weight || !gender || !stage) {
      setRecommendation("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setRecommendation("");

    try {
      const response = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ breed, age, weight, gender, health, stage, milkYield }),
      });

      if (!response.ok) throw new Error("Failed to get recommendation");

      const data = await response.json();
      setRecommendation(data.recommendation);
      setProtein(data.protein);
      setEnergy(data.energy);
    } catch (err: any) {
      setRecommendation("Error: " + err.message);
      setProtein(0);
      setEnergy("moderate");
    } finally {
      setLoading(false);
    }
  };

  const energyColor =
    energy === "high"
      ? "bg-green-500"
      : energy === "moderate"
      ? "bg-yellow-400"
      : energy === "low"
      ? "bg-red-400"
      : "bg-blue-400";

  return (
    <div className="min-h-screen bg-gray-400 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-white-700">
         Nutrition Recommendation
      </h1>

      <div className="bg-stone-200 shadow-md rounded-lg p-6 w-full max-w-lg space-y-4">
        {/* Breed */}
        <div>
          <label className="block mb-1 font-medium">Breed</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          >
            <option value="">Select Breed</option>
            {breeds.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="block mb-1 font-medium">Age (months)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter age in months"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block mb-1 font-medium">Weight (kg)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter weight in kg"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={gender}
            onChange={(e) => setGender(e.target.value as GenderOption)}
          >
            <option value="">Select Gender</option>
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Stage */}
        <div>
          <label className="block mb-1 font-medium">Production Stage</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={stage}
            onChange={(e) => setStage(e.target.value as StageOption)}
          >
            <option value="">Select Stage</option>
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Milk Yield */}
        {stage === "Lactating" && (
          <div>
            <label className="block mb-1 font-medium">Milk Yield (L/day)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter milk yield in liters"
              value={milkYield}
              onChange={(e) => setMilkYield(Number(e.target.value))}
            />
          </div>
        )}

        {/* Health */}
        <div>
          <label className="block mb-1 font-medium">Health Issue</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={health}
            onChange={(e) => setHealth(e.target.value as HealthOption)}
          >
            {healthIssues.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        {/* Button */}
        <button
          onClick={getNutritionRecommendation}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded mt-2"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Get Recommendation"}
        </button>
      </div>

      {/* Recommendation Card */}
      {recommendation && (
        <div className="mt-6 w-full max-w-lg bg-green-50 border border-green-300 p-4 rounded-lg">
          <pre className="whitespace-pre-line">{recommendation}</pre>

          {/* Protein Bar */}
          <div className="mt-2">
            <label className="block font-medium text-sm">Protein (%)</label>
            <div className="w-full h-4 bg-gray-200 rounded">
              <div
                className="h-4 bg-green-500 rounded"
                style={{ width: `${Math.min(protein * 5, 100)}%` }}
              />
            </div>
          </div>

          {/* Energy Bar */}
          <div className="mt-2">
            <label className="block font-medium text-sm">Energy</label>
            <div className="w-full h-4 bg-gray-200 rounded">
              <div className={`h-4 ${energyColor} rounded`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
