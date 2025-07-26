import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with email/password authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Livestock profiles table
export const livestock = pgTable("livestock", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  species: varchar("species").notNull(), // cattle, sheep, goat, pig
  breed: varchar("breed"),
  gender: varchar("gender").notNull(), // male, female
  dateOfBirth: date("date_of_birth"),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  status: varchar("status").notNull().default("healthy"), // healthy, treatment, monitoring
  photoUrl: varchar("photo_url"),
  tagNumber: varchar("tag_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Health records table
export const healthRecords = pgTable("health_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  livestockId: varchar("livestock_id").notNull().references(() => livestock.id, { onDelete: "cascade" }),
  recordType: varchar("record_type").notNull(), // vaccination, treatment, checkup, diagnosis
  title: varchar("title").notNull(),
  description: text("description"),
  veterinarian: varchar("veterinarian"),
  medication: varchar("medication"),
  dosage: varchar("dosage"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  recordDate: timestamp("record_date").notNull(),
  followUpDate: timestamp("follow_up_date"),
  attachments: text("attachments").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Medicine reminders table
export const medicineReminders = pgTable("medicine_reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  livestockId: varchar("livestock_id").notNull().references(() => livestock.id, { onDelete: "cascade" }),
  medicineName: varchar("medicine_name").notNull(),
  dosage: varchar("dosage").notNull(),
  frequency: varchar("frequency").notNull(), // daily, weekly, monthly
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  nextDueDate: timestamp("next_due_date").notNull(),
  isCompleted: boolean("is_completed").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vaccination reminders table
export const vaccinationReminders = pgTable("vaccination_reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  livestockId: varchar("livestock_id").notNull().references(() => livestock.id, { onDelete: "cascade" }),
  vaccineName: varchar("vaccine_name").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  isCompleted: boolean("is_completed").default(false),
  batchNumber: varchar("batch_number"),
  veterinarian: varchar("veterinarian"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Disease information table
export const diseases = pgTable("diseases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  species: varchar("species").array().notNull(), // which species it affects
  symptoms: text("symptoms").array().notNull(),
  treatment: text("treatment").notNull(),
  prevention: text("prevention").notNull(),
  severity: varchar("severity").notNull(), // low, medium, high
  contagious: boolean("contagious").default(false),
  emergencyProtocol: text("emergency_protocol"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community forum posts table
export const forumPosts = pgTable("forum_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category").notNull(), // health, nutrition, breeding, general
  tags: varchar("tags").array(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum replies table
export const forumReplies = pgTable("forum_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull().references(() => forumPosts.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  isBestAnswer: boolean("is_best_answer").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activity logs table
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  livestockId: varchar("livestock_id").references(() => livestock.id, { onDelete: "cascade" }),
  action: varchar("action").notNull(), // vaccination_completed, medicine_given, checkup_scheduled, etc.
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chatbot conversations table
export const chatbotConversations = pgTable("chatbot_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chatbot messages table
export const chatbotMessages = pgTable("chatbot_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => chatbotConversations.id, { onDelete: "cascade" }),
  role: varchar("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  livestock: many(livestock),
  forumPosts: many(forumPosts),
  forumReplies: many(forumReplies),
  activityLogs: many(activityLogs),
  chatbotConversations: many(chatbotConversations),
}));

export const livestockRelations = relations(livestock, ({ one, many }) => ({
  user: one(users, {
    fields: [livestock.userId],
    references: [users.id],
  }),
  healthRecords: many(healthRecords),
  medicineReminders: many(medicineReminders),
  vaccinationReminders: many(vaccinationReminders),
  activityLogs: many(activityLogs),
}));

export const healthRecordsRelations = relations(healthRecords, ({ one }) => ({
  livestock: one(livestock, {
    fields: [healthRecords.livestockId],
    references: [livestock.id],
  }),
}));

export const medicineRemindersRelations = relations(medicineReminders, ({ one }) => ({
  livestock: one(livestock, {
    fields: [medicineReminders.livestockId],
    references: [livestock.id],
  }),
}));

export const vaccinationRemindersRelations = relations(vaccinationReminders, ({ one }) => ({
  livestock: one(livestock, {
    fields: [vaccinationReminders.livestockId],
    references: [livestock.id],
  }),
}));

export const forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
  user: one(users, {
    fields: [forumPosts.userId],
    references: [users.id],
  }),
  replies: many(forumReplies),
}));

export const forumRepliesRelations = relations(forumReplies, ({ one }) => ({
  post: one(forumPosts, {
    fields: [forumReplies.postId],
    references: [forumPosts.id],
  }),
  user: one(users, {
    fields: [forumReplies.userId],
    references: [users.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
  livestock: one(livestock, {
    fields: [activityLogs.livestockId],
    references: [livestock.id],
  }),
}));

export const chatbotConversationsRelations = relations(chatbotConversations, ({ one, many }) => ({
  user: one(users, {
    fields: [chatbotConversations.userId],
    references: [users.id],
  }),
  messages: many(chatbotMessages),
}));

export const chatbotMessagesRelations = relations(chatbotMessages, ({ one }) => ({
  conversation: one(chatbotConversations, {
    fields: [chatbotMessages.conversationId],
    references: [chatbotConversations.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatbotConversationSchema = createInsertSchema(chatbotConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatbotMessageSchema = createInsertSchema(chatbotMessages).omit({
  id: true,
  createdAt: true,
});

export const insertLivestockSchema = createInsertSchema(livestock).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHealthRecordSchema = createInsertSchema(healthRecords).omit({
  id: true,
  createdAt: true,
});

export const insertMedicineReminderSchema = createInsertSchema(medicineReminders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVaccinationReminderSchema = createInsertSchema(vaccinationReminders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  isResolved: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  isBestAnswer: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLivestock = z.infer<typeof insertLivestockSchema>;
export type Livestock = typeof livestock.$inferSelect;
export type InsertHealthRecord = z.infer<typeof insertHealthRecordSchema>;
export type HealthRecord = typeof healthRecords.$inferSelect;
export type InsertMedicineReminder = z.infer<typeof insertMedicineReminderSchema>;
export type MedicineReminder = typeof medicineReminders.$inferSelect;
export type InsertVaccinationReminder = z.infer<typeof insertVaccinationReminderSchema>;
export type VaccinationReminder = typeof vaccinationReminders.$inferSelect;
export type Disease = typeof diseases.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertChatbotConversation = z.infer<typeof insertChatbotConversationSchema>;
export type ChatbotConversation = typeof chatbotConversations.$inferSelect;
export type InsertChatbotMessage = z.infer<typeof insertChatbotMessageSchema>;
export type ChatbotMessage = typeof chatbotMessages.$inferSelect;
