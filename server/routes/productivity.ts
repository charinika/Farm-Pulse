// routes/productivity.ts
import express from "express";
import { db } from "../db"; // Your Drizzle instance
import { productivity } from "../schema/productivity"; // Productivity table schema
import { eq } from "drizzle-orm";

const router = express.Router();

// GET productivity records for a specific animal
router.get("/animal/:animalId", async (req, res) => {
  const { animalId } = req.params;

  try {
    const records = await db
      .select()
      .from(productivity)
      .where(eq(productivity.animalId, Number(animalId))); // ✅ cast to number

    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching productivity records:", error);
    res.status(500).json({ error: "Failed to fetch productivity records." });
  }
});

export default router;
