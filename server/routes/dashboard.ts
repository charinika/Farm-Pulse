import { Router } from "express";
import { db } from "../db";
import { livestock, healthRecords, reminders, activityLogs } from "@shared/schema";
import { count } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // total livestock
    const livestockCount = await db.select({ value: count() }).from(livestock);

    // total health records
    const healthRecordCount = await db.select({ value: count() }).from(healthRecords);

    // total reminders
    const reminderCount = await db.select({ value: count() }).from(reminders);

    // total activities
    const activityCount = await db.select({ value: count() }).from(activityLogs);

    res.json({
      livestock: livestockCount[0]?.value || 0,
      healthRecords: healthRecordCount[0]?.value || 0,
      reminders: reminderCount[0]?.value || 0,
      activities: activityCount[0]?.value || 0,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

export default router;
