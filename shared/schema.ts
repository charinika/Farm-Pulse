import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
// SESSION (for connect-pg-simple)
import { json } from "drizzle-orm/pg-core";

export const session = pgTable("session", {
  sid: varchar("sid", { length: 255 }).primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire", { withTimezone: false, mode: "date" }).notNull(),
});

// USERS
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
});
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

// REMINDERS
export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  note: text("note"),
  user_id: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// LIVESTOCK
export const livestock = pgTable("livestock", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  species: varchar("species", { length: 100 }).notNull(),
  age: integer("age"),
  owner_id: integer("owner_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
});
export const insertLivestockSchema = createInsertSchema(livestock).omit({ id: true });
export type InsertLivestock = z.infer<typeof insertLivestockSchema>;

// HEALTH RECORDS
export const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),
  livestock_id: integer("livestock_id")
    .references(() => livestock.id, { onDelete: "cascade" })
    .notNull(),
  condition: text("condition").notNull(),
  treatment: text("treatment"),
  health_status: varchar("health_status", { length: 50 }).notNull().default("unknown"), // ✅ new column
  recorded_at: timestamp("recorded_at", { withTimezone: true }).defaultNow(),
});
export const insertHealthRecordSchema = createInsertSchema(healthRecords).omit({ id: true });
export type InsertHealthRecord = z.infer<typeof insertHealthRecordSchema>;


// MEDICINE REMINDERS
export const medicineReminders = pgTable("medicine_reminders", {
  id: serial("id").primaryKey(),
  livestock_id: integer("livestock_id").references(() => livestock.id, { onDelete: "cascade" }).notNull(),
  medicine: text("medicine").notNull(),
  dosage: text("dosage"),
  schedule: timestamp("schedule", { withTimezone: true }).notNull(),
});
export const insertMedicineReminderSchema = createInsertSchema(medicineReminders).omit({ id: true });
export type InsertMedicineReminder = z.infer<typeof insertMedicineReminderSchema>;

// VACCINATION REMINDERS
export const vaccinationReminders = pgTable("vaccination_reminders", {
  id: serial("id").primaryKey(),
  livestock_id: integer("livestock_id").references(() => livestock.id, { onDelete: "cascade" }).notNull(),
  vaccine: text("vaccine").notNull(),
  schedule: timestamp("schedule", { withTimezone: true }).notNull(),
});
export const insertVaccinationReminderSchema = createInsertSchema(vaccinationReminders).omit({ id: true });
export type InsertVaccinationReminder = z.infer<typeof insertVaccinationReminderSchema>;

// DISEASES
export const diseases = pgTable("diseases", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  symptoms: text("symptoms"),
  prevention: text("prevention"),
});

// FORUM POSTS
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
export const insertForumPostSchema = createInsertSchema(forumPosts).omit({ id: true });
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;

// FORUM REPLIES
export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  post_id: integer("post_id").references(() => forumPosts.id, { onDelete: "cascade" }).notNull(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
export const insertForumReplySchema = createInsertSchema(forumReplies).omit({ id: true });
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;

// ACTIVITY LOGS
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  activity: text("activity").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
});
export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({ id: true });
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

// CHATBOT CONVERSATIONS
export const chatbotConversations = pgTable("chatbot_conversations", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  started_at: timestamp("started_at", { withTimezone: true }).defaultNow(),
});
export const insertChatbotConversationSchema = createInsertSchema(chatbotConversations).omit({ id: true });
export type InsertChatbotConversation = z.infer<typeof insertChatbotConversationSchema>;

// CHATBOT MESSAGES
export const chatbotMessages = pgTable("chatbot_messages", {
  id: serial("id").primaryKey(),
  conversation_id: integer("conversation_id").references(() => chatbotConversations.id, { onDelete: "cascade" }).notNull(),
  sender: varchar("sender", { length: 20 }).notNull(),
  message: text("message").notNull(),
  sent_at: timestamp("sent_at", { withTimezone: true }).defaultNow(),
});
export const insertChatbotMessageSchema = createInsertSchema(chatbotMessages).omit({ id: true });
export type InsertChatbotMessage = z.infer<typeof insertChatbotMessageSchema>;

// RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
  reminders: many(reminders),
  livestock: many(livestock),
  forumPosts: many(forumPosts),
  forumReplies: many(forumReplies),
  activityLogs: many(activityLogs),
  chatbotConversations: many(chatbotConversations),
}));

export const remindersRelations = relations(reminders, ({ one }) => ({
  user: one(users, {
    fields: [reminders.user_id],
    references: [users.id],
  }),
}));
