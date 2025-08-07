// server/db/schema/productivity.ts
import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";

export const productivity = pgTable("productivity", {
  id: uuid("id").defaultRandom().primaryKey(),
  livestockId: uuid("livestock_id").notNull(),
  date: timestamp("date").notNull(),
  note: text("note"),
  value: integer("value").notNull(),
});
