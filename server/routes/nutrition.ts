// server/routes/nutrition.ts
import { Router } from "express";

const router = Router();

// Breed-specific base data
const breedData: Record<
  string,
  { calf: number; growing: number; adult: number; proteinBase: number }
> = {
  Holstein: { calf: 0.04, growing: 0.035, adult: 0.05, proteinBase: 16 },
  Jersey: { calf: 0.045, growing: 0.038, adult: 0.048, proteinBase: 18 },
  Gir: { calf: 0.04, growing: 0.035, adult: 0.05, proteinBase: 15 },
  Sahiwal: { calf: 0.04, growing: 0.035, adult: 0.05, proteinBase: 16 },
  Crossbreed: { calf: 0.042, growing: 0.037, adult: 0.051, proteinBase: 17 },
};

router.post("/", (req, res) => {
  const { breed, age, weight, gender, health, stage, milkYield } = req.body;

  if (!breed || !age || !weight || !gender || !stage) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const breedInfo = breedData[breed] || { calf: 0.03, growing: 0.03, adult: 0.03, proteinBase: 16 };

  // Base feedFactor & protein by stage
  let feedFactor: number;
  switch (stage) {
    case "Calf":
      feedFactor = breedInfo.calf;
      break;
    case "Growing":
      feedFactor = breedInfo.growing;
      break;
    case "Lactating":
    case "Dry":
      feedFactor = breedInfo.adult;
      break;
    default:
      feedFactor = breedInfo.adult;
  }

  let protein = breedInfo.proteinBase;
  let energy: "low" | "moderate" | "high" | "easily digestible" = "moderate";

  // Adjust for milk yield
  if (stage === "Lactating" && milkYield) {
    feedFactor += 0.005 * (milkYield / 5); // higher milk => more feed
    protein += Math.min(5, milkYield * 0.3); // increase protein for milk
    energy = milkYield > 10 ? "high" : "moderate";
  }

  // Gender adjustment
  if (gender === "Female" && stage === "Lactating") {
    feedFactor += 0.005;
  }

  // Health adjustments and tips
  const tips: string[] = [];
  switch (health) {
    case "Digestive":
      energy = "easily digestible";
      tips.push("Use silage or hay instead of large concentrates.");
      break;
    case "Milk Fever":
      protein = Math.min(protein, 16);
      tips.push("Include calcium supplements before calving.");
      break;
    case "Parasite":
      protein += 2;
      energy = "high";
      tips.push("Deworm regularly and provide clean water.");
      break;
    case "Weak":
      protein += 3;
      energy = "high";
      tips.push("Feed energy-rich concentrates and ensure hydration.");
      break;
  }

  const feedAmount = (weight * feedFactor).toFixed(1);

  const recommendation = `
Breed: ${breed}
Age: ${age} months
Weight: ${weight} kg
Gender: ${gender}
Production Stage: ${stage}
Health Issue: ${health}

Recommendation:
Feed approx ${feedAmount} kg/day of dry matter. 
Protein: ${protein}%. 
Energy: ${energy}. 
Provide minerals and vitamins as needed.
${tips.join("\n")}
  `;

  return res.json({ recommendation: recommendation.trim(), feedAmount: Number(feedAmount), protein, energy });
});

export default router;
