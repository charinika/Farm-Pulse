import { Router } from "express";
import { db } from "../db";
import { livestock } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * 📌 Get all livestock
 */
router.get("/", async (req, res) => {
  try {
    const animals = await db.select().from(livestock);
    res.json(animals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch livestock" });
  }
});

/**
 * 📌 Get single animal by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const animal = await db
      .select()
      .from(livestock)
      .where(eq(livestock.id, Number(id)));

    if (animal.length === 0) {
      return res.status(404).json({ error: "Animal not found" });
    }

    res.json(animal[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch animal" });
  }
});

/**
 * 📌 Add new animal
 */
router.post("/", async (req, res) => {
  try {
    const { name, species, age, owner_id } = req.body;

    if (!name || !species || !owner_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newAnimal = await db
      .insert(livestock)
      .values({
        name,
        species,
        age: age || null,
        owner_id,
      })
      .returning();

    res.status(201).json(newAnimal[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add animal" });
  }
});

/**
 * 📌 Update animal by ID
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await db
      .update(livestock)
      .set(updates)
      .where(eq(livestock.id, Number(id)))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ error: "Animal not found" });
    }

    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update livestock" });
  }
});

/**
 * 📌 Delete animal by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(livestock)
      .where(eq(livestock.id, Number(id)))
      .returning();

    if (deleted.length === 0) {
      return res.status(404).json({ error: "Animal not found" });
    }

    res.json({ success: true, deleted: deleted[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete livestock" });
  }
});

export default router;
