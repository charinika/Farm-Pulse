// server/routes/symptoms.ts
import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFile = path.join(__dirname, "../data/symptom_alerts.json");

// Ensure data folder + file exist
function ensureDataFile() {
  const dir = path.dirname(dataFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]", "utf-8");
}

type SymptomEntry = {
  id: number;
  animal_id: string;
  symptoms: string[];
  predicted_disease: string;
  risk_level: string;
  action: string;
  timestamp: string;
};

type Rule = { match: string[]; disease: string; risk: string; action: string };
type Prediction = { disease: string; risk: string; action: string; score?: number };

function loadAlerts(): SymptomEntry[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(dataFile, "utf-8");
    return JSON.parse(raw) as SymptomEntry[];
  } catch (err) {
    console.error("Failed to read alerts file:", err);
    return [];
  }
}

function saveAlerts(alerts: SymptomEntry[]) {
  ensureDataFile();
  try {
    fs.writeFileSync(dataFile, JSON.stringify(alerts, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write alerts file:", err);
    throw err;
  }
}

// --- Improved prediction ---
function predictDisease(symptoms: string[]): Prediction[] {
  const rules: Rule[] = [
    { match: ["fever", "cough", "nasal discharge"], disease: "Pneumonia", risk: "High", action: "Isolate animal, call veterinarian, provide antibiotics" },
    { match: ["diarrhea", "loss of appetite", "dehydration"], disease: "Enterotoxemia", risk: "High", action: "Provide fluids, call vet, maintain hygiene" },
    { match: ["lameness", "swollen joints"], disease: "Foot and Mouth Disease", risk: "Medium", action: "Isolate animal, sanitize barn, inform vet" },
    { match: ["weight loss", "diarrhea", "rough coat"], disease: "Worm Infestation", risk: "Medium", action: "Deworm under vet guidance, maintain pasture hygiene" },
    { match: ["milk drop", "udder swelling", "fever"], disease: "Mastitis", risk: "High", action: "Milk frequently, keep udder clean, consult vet for antibiotics" },
    { match: ["abortion", "retained placenta", "weak calves"], disease: "Brucellosis", risk: "High", action: "Isolate, notify vet, follow biosecurity measures" },
    { match: ["bloating", "abdominal pain", "no appetite"], disease: "Bloat", risk: "High", action: "Call vet urgently, relieve gas" },
    { match: ["cough", "fever", "labored breathing"], disease: "Respiratory Infection", risk: "Medium", action: "Provide clean air, isolate, consult vet" },
    { match: ["fever", "drooling", "blisters in mouth"], disease: "Foot and Mouth Disease", risk: "High", action: "Strict isolation, notify vet, disinfect environment" },
    { match: ["weakness", "pale gums", "weight loss"], disease: "Anemia", risk: "Medium", action: "Supplement iron/minerals, check for parasites, consult vet" },
    { match: ["cough", "loss of appetite"], disease: "Respiratory Infection", risk: "Medium", action: "Provide clean air, isolate if needed, consult vet" },
  ];

  const normalizedSymptoms = symptoms.map(s => s.toLowerCase().trim());

  // Calculate match score for each rule
  const scored: (Prediction & { score: number })[] = rules.map(rule => {
    const matchCount = rule.match.filter(r => normalizedSymptoms.includes(r.toLowerCase())).length;
    const score = rule.match.length > 0 ? matchCount / rule.match.length : 0;
    return { disease: rule.disease, risk: rule.risk, action: rule.action, score };
  });

  // Sort descending by score
  const sorted = scored.sort((a, b) => b.score - a.score);

  // Return top matches (at least one symptom matched)
  const topMatches = sorted.filter(r => r.score > 0);

  if (topMatches.length === 0) {
    return [{
      disease: "Unknown",
      risk: "Low",
      action: "Monitor animal, consult vet if persists"
    }];
  }

  return topMatches.map(m => ({
    disease: m.disease,
    risk: m.risk,
    action: m.action,
    score: Number(m.score.toFixed(2))
  }));
}

// POST /api/symptoms
router.post("/", (req, res) => {
  try {
    const { animal_id, symptoms } = req.body;
    if (!animal_id || !symptoms || !Array.isArray(symptoms)) {
      return res.status(400).json({ success: false, error: "animal_id and symptoms[] required" });
    }

    const alerts = loadAlerts();
    const predictions = predictDisease(symptoms);

    predictions.forEach(pred => {
      alerts.push({
        id: alerts.length + 1,
        animal_id: String(animal_id),
        symptoms,
        predicted_disease: pred.disease,
        risk_level: pred.risk,
        action: pred.action,
        timestamp: new Date().toISOString()
      });
    });

    saveAlerts(alerts);

    return res.json({ success: true, predictions });
  } catch (err) {
    console.error("POST /api/symptoms error:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/symptoms?animal_id=XXX
router.get("/", (req, res) => {
  try {
    const { animal_id } = req.query;
    if (!animal_id) return res.status(400).json({ success: false, error: "animal_id required" });

    const alerts = loadAlerts();
    const history = alerts.filter((a: SymptomEntry) => a.animal_id === String(animal_id));

    return res.json({ success: true, history });
  } catch (err) {
    console.error("GET /api/symptoms error:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
