import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

export const reminders = pgTable("reminders", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(), // 'medicine' or 'vaccination'
  title: text("title").notNull(),
  animalName: text("animal_name"),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  isOverdue: boolean("is_overdue").default(false),
  description: text("description"),
});
