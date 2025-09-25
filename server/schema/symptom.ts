// /server/schema.ts
import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";

// --------------------
// Livestock table
// --------------------
export const livestock = pgTable("livestock", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age"),
  breed: text("breed"),
  animal_type: text("animal_type"),
  gender: text("gender"),
  weight: real("weight"),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});

// --------------------
// Symptom Alerts table
// --------------------
export const symptom_alerts = pgTable("symptom_alerts", {
  id: serial("id").primaryKey(),
  animal_id: integer("animal_id").references(() => livestock.id),
  symptoms: text("symptoms").notNull(),
  predicted_disease: text("predicted_disease"),
  risk_level: text("risk_level"),
  action: text("action"),
  created_at: timestamp("created_at").defaultNow(),
});
