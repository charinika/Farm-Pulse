import {
  users,
  livestock,
  healthRecords,
  medicineReminders,
  vaccinationReminders,
  diseases,
  forumPosts,
  forumReplies,
  activityLogs,
  type User,
  type UpsertUser,
  type Livestock,
  type InsertLivestock,
  type HealthRecord,
  type InsertHealthRecord,
  type MedicineReminder,
  type InsertMedicineReminder,
  type VaccinationReminder,
  type InsertVaccinationReminder,
  type Disease,
  type ForumPost,
  type InsertForumPost,
  type ForumReply,
  type InsertForumReply,
  type ActivityLog,
  type InsertActivityLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, gte, lte, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Livestock operations
  getLivestock(userId: string): Promise<Livestock[]>;
  getLivestockById(id: string, userId: string): Promise<Livestock | undefined>;
  createLivestock(livestock: InsertLivestock): Promise<Livestock>;
  updateLivestock(id: string, livestock: Partial<InsertLivestock>, userId: string): Promise<Livestock | undefined>;
  deleteLivestock(id: string, userId: string): Promise<boolean>;
  
  // Health records operations
  getHealthRecords(livestockId: string): Promise<HealthRecord[]>;
  createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord>;
  
  // Medicine reminders operations
  getMedicineReminders(userId: string): Promise<MedicineReminder[]>;
  getOverdueMedicineReminders(userId: string): Promise<MedicineReminder[]>;
  createMedicineReminder(reminder: InsertMedicineReminder): Promise<MedicineReminder>;
  updateMedicineReminder(id: string, reminder: Partial<InsertMedicineReminder>): Promise<MedicineReminder | undefined>;
  
  // Vaccination reminders operations
  getVaccinationReminders(userId: string): Promise<VaccinationReminder[]>;
  getOverdueVaccinationReminders(userId: string): Promise<VaccinationReminder[]>;
  createVaccinationReminder(reminder: InsertVaccinationReminder): Promise<VaccinationReminder>;
  updateVaccinationReminder(id: string, reminder: Partial<InsertVaccinationReminder>): Promise<VaccinationReminder | undefined>;
  
  // Disease operations
  getDiseases(): Promise<Disease[]>;
  searchDiseases(query: string): Promise<Disease[]>;
  
  // Forum operations
  getForumPosts(category?: string): Promise<(ForumPost & { user: User; replyCount: number })[]>;
  getForumPost(id: string): Promise<(ForumPost & { user: User }) | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumReplies(postId: string): Promise<(ForumReply & { user: User })[]>;
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  
  // Activity logs operations
  getActivityLogs(userId: string, limit?: number): Promise<(ActivityLog & { livestock?: Livestock })[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  
  // Dashboard metrics
  getDashboardMetrics(userId: string): Promise<{
    totalLivestock: number;
    healthyAnimals: number;
    pendingReminders: number;
    monthlyExpenses: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Livestock operations
  async getLivestock(userId: string): Promise<Livestock[]> {
    return await db
      .select()
      .from(livestock)
      .where(eq(livestock.userId, userId))
      .orderBy(desc(livestock.createdAt));
  }

  async getLivestockById(id: string, userId: string): Promise<Livestock | undefined> {
    const [animal] = await db
      .select()
      .from(livestock)
      .where(and(eq(livestock.id, id), eq(livestock.userId, userId)));
    return animal;
  }

  async createLivestock(livestockData: InsertLivestock): Promise<Livestock> {
    const [animal] = await db
      .insert(livestock)
      .values(livestockData)
      .returning();
    return animal;
  }

  async updateLivestock(id: string, livestockData: Partial<InsertLivestock>, userId: string): Promise<Livestock | undefined> {
    const [animal] = await db
      .update(livestock)
      .set({ ...livestockData, updatedAt: new Date() })
      .where(and(eq(livestock.id, id), eq(livestock.userId, userId)))
      .returning();
    return animal;
  }

  async deleteLivestock(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(livestock)
      .where(and(eq(livestock.id, id), eq(livestock.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Health records operations
  async getHealthRecords(livestockId: string): Promise<HealthRecord[]> {
    return await db
      .select()
      .from(healthRecords)
      .where(eq(healthRecords.livestockId, livestockId))
      .orderBy(desc(healthRecords.recordDate));
  }

  async createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord> {
    const [healthRecord] = await db
      .insert(healthRecords)
      .values(record)
      .returning();
    return healthRecord;
  }

  // Medicine reminders operations
  async getMedicineReminders(userId: string): Promise<MedicineReminder[]> {
    const results = await db
      .select({
        id: medicineReminders.id,
        livestockId: medicineReminders.livestockId,
        medicineName: medicineReminders.medicineName,
        dosage: medicineReminders.dosage,
        frequency: medicineReminders.frequency,
        startDate: medicineReminders.startDate,
        endDate: medicineReminders.endDate,
        nextDueDate: medicineReminders.nextDueDate,
        isCompleted: medicineReminders.isCompleted,
        notes: medicineReminders.notes,
        createdAt: medicineReminders.createdAt,
        updatedAt: medicineReminders.updatedAt,
      })
      .from(medicineReminders)
      .innerJoin(livestock, eq(medicineReminders.livestockId, livestock.id))
      .where(eq(livestock.userId, userId))
      .orderBy(medicineReminders.nextDueDate);
    return results;
  }

  async getOverdueMedicineReminders(userId: string): Promise<MedicineReminder[]> {
    const now = new Date();
    const results = await db
      .select({
        id: medicineReminders.id,
        livestockId: medicineReminders.livestockId,
        medicineName: medicineReminders.medicineName,
        dosage: medicineReminders.dosage,
        frequency: medicineReminders.frequency,
        startDate: medicineReminders.startDate,
        endDate: medicineReminders.endDate,
        nextDueDate: medicineReminders.nextDueDate,
        isCompleted: medicineReminders.isCompleted,
        notes: medicineReminders.notes,
        createdAt: medicineReminders.createdAt,
        updatedAt: medicineReminders.updatedAt,
      })
      .from(medicineReminders)
      .innerJoin(livestock, eq(medicineReminders.livestockId, livestock.id))
      .where(
        and(
          eq(livestock.userId, userId),
          eq(medicineReminders.isCompleted, false),
          lte(medicineReminders.nextDueDate, now)
        )
      )
      .orderBy(medicineReminders.nextDueDate);
    return results;
  }

  async createMedicineReminder(reminder: InsertMedicineReminder): Promise<MedicineReminder> {
    const [medicineReminder] = await db
      .insert(medicineReminders)
      .values(reminder)
      .returning();
    return medicineReminder;
  }

  async updateMedicineReminder(id: string, reminder: Partial<InsertMedicineReminder>): Promise<MedicineReminder | undefined> {
    const [updated] = await db
      .update(medicineReminders)
      .set({ ...reminder, updatedAt: new Date() })
      .where(eq(medicineReminders.id, id))
      .returning();
    return updated;
  }

  // Vaccination reminders operations
  async getVaccinationReminders(userId: string): Promise<VaccinationReminder[]> {
    const results = await db
      .select({
        id: vaccinationReminders.id,
        livestockId: vaccinationReminders.livestockId,
        vaccineName: vaccinationReminders.vaccineName,
        scheduledDate: vaccinationReminders.scheduledDate,
        batchNumber: vaccinationReminders.batchNumber,
        veterinarian: vaccinationReminders.veterinarian,
        isCompleted: vaccinationReminders.isCompleted,
        notes: vaccinationReminders.notes,
        createdAt: vaccinationReminders.createdAt,
        updatedAt: vaccinationReminders.updatedAt,
      })
      .from(vaccinationReminders)
      .innerJoin(livestock, eq(vaccinationReminders.livestockId, livestock.id))
      .where(eq(livestock.userId, userId))
      .orderBy(vaccinationReminders.scheduledDate);
    return results;
  }

  async getOverdueVaccinationReminders(userId: string): Promise<VaccinationReminder[]> {
    const now = new Date();
    const results = await db
      .select({
        id: vaccinationReminders.id,
        livestockId: vaccinationReminders.livestockId,
        vaccineName: vaccinationReminders.vaccineName,
        scheduledDate: vaccinationReminders.scheduledDate,
        batchNumber: vaccinationReminders.batchNumber,
        veterinarian: vaccinationReminders.veterinarian,
        isCompleted: vaccinationReminders.isCompleted,
        notes: vaccinationReminders.notes,
        createdAt: vaccinationReminders.createdAt,
        updatedAt: vaccinationReminders.updatedAt,
      })
      .from(vaccinationReminders)
      .innerJoin(livestock, eq(vaccinationReminders.livestockId, livestock.id))
      .where(
        and(
          eq(livestock.userId, userId),
          eq(vaccinationReminders.isCompleted, false),
          lte(vaccinationReminders.scheduledDate, now)
        )
      )
      .orderBy(vaccinationReminders.scheduledDate);
    return results;
  }

  async createVaccinationReminder(reminder: InsertVaccinationReminder): Promise<VaccinationReminder> {
    const [vaccinationReminder] = await db
      .insert(vaccinationReminders)
      .values(reminder)
      .returning();
    return vaccinationReminder;
  }

  async updateVaccinationReminder(id: string, reminder: Partial<InsertVaccinationReminder>): Promise<VaccinationReminder | undefined> {
    const [updated] = await db
      .update(vaccinationReminders)
      .set({ ...reminder, updatedAt: new Date() })
      .where(eq(vaccinationReminders.id, id))
      .returning();
    return updated;
  }

  // Disease operations
  async getDiseases(): Promise<Disease[]> {
    return await db.select().from(diseases).orderBy(diseases.name);
  }

  async searchDiseases(query: string): Promise<Disease[]> {
    return await db
      .select()
      .from(diseases)
      .where(
        or(
          like(diseases.name, `%${query}%`),
          like(diseases.symptoms, `%${query}%`)
        )
      )
      .orderBy(diseases.name);
  }

  // Forum operations
  async getForumPosts(category?: string): Promise<any[]> {
    const query = db
      .select({
        id: forumPosts.id,
        title: forumPosts.title,
        content: forumPosts.content,
        category: forumPosts.category,
        tags: forumPosts.tags,
        upvotes: forumPosts.upvotes,
        downvotes: forumPosts.downvotes,
        isResolved: forumPosts.isResolved,
        userId: forumPosts.userId,
        createdAt: forumPosts.createdAt,
        updatedAt: forumPosts.updatedAt,
        userName: users.firstName,
        userEmail: users.email,
      })
      .from(forumPosts)
      .innerJoin(users, eq(forumPosts.userId, users.id))
      .orderBy(desc(forumPosts.createdAt));

    if (category) {
      query.where(eq(forumPosts.category, category));
    }

    return await query;
  }

  async getForumPost(id: string): Promise<any | undefined> {
    const [post] = await db
      .select({
        id: forumPosts.id,
        title: forumPosts.title,
        content: forumPosts.content,
        category: forumPosts.category,
        tags: forumPosts.tags,
        upvotes: forumPosts.upvotes,
        downvotes: forumPosts.downvotes,
        isResolved: forumPosts.isResolved,
        userId: forumPosts.userId,
        createdAt: forumPosts.createdAt,
        updatedAt: forumPosts.updatedAt,
        userName: users.firstName,
        userEmail: users.email,
      })
      .from(forumPosts)
      .innerJoin(users, eq(forumPosts.userId, users.id))
      .where(eq(forumPosts.id, id));
    return post;
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [forumPost] = await db
      .insert(forumPosts)
      .values(post)
      .returning();
    return forumPost;
  }

  async getForumReplies(postId: string): Promise<any[]> {
    return await db
      .select({
        id: forumReplies.id,
        content: forumReplies.content,
        upvotes: forumReplies.upvotes,
        downvotes: forumReplies.downvotes,
        isBestAnswer: forumReplies.isBestAnswer,
        postId: forumReplies.postId,
        userId: forumReplies.userId,
        createdAt: forumReplies.createdAt,
        updatedAt: forumReplies.updatedAt,
        userName: users.firstName,
        userEmail: users.email,
      })
      .from(forumReplies)
      .innerJoin(users, eq(forumReplies.userId, users.id))
      .where(eq(forumReplies.postId, postId))
      .orderBy(desc(forumReplies.createdAt));
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const [forumReply] = await db
      .insert(forumReplies)
      .values(reply)
      .returning();
    return forumReply;
  }

  // Activity logs operations
  async getActivityLogs(userId: string, limit = 10): Promise<any[]> {
    return await db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        description: activityLogs.description,
        metadata: activityLogs.metadata,
        userId: activityLogs.userId,
        livestockId: activityLogs.livestockId,
        createdAt: activityLogs.createdAt,
        livestockName: livestock.name,
        livestockStatus: livestock.status,
      })
      .from(activityLogs)
      .leftJoin(livestock, eq(activityLogs.livestockId, livestock.id))
      .where(eq(activityLogs.userId, userId))
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [activityLog] = await db
      .insert(activityLogs)
      .values(log)
      .returning();
    return activityLog;
  }

  // Dashboard metrics
  async getDashboardMetrics(userId: string): Promise<{
    totalLivestock: number;
    healthyAnimals: number;
    pendingReminders: number;
    monthlyExpenses: number;
  }> {
    // Get total livestock count
    const [totalLivestockResult] = await db
      .select({ count: count() })
      .from(livestock)
      .where(eq(livestock.userId, userId));

    // Get healthy animals count
    const [healthyAnimalsResult] = await db
      .select({ count: count() })
      .from(livestock)
      .where(and(eq(livestock.userId, userId), eq(livestock.status, "healthy")));

    // Get pending medicine reminders count
    const now = new Date();
    const [pendingMedicineResult] = await db
      .select({ count: count() })
      .from(medicineReminders)
      .innerJoin(livestock, eq(medicineReminders.livestockId, livestock.id))
      .where(
        and(
          eq(livestock.userId, userId),
          eq(medicineReminders.isCompleted, false),
          lte(medicineReminders.nextDueDate, now)
        )
      );

    // Get pending vaccination reminders count
    const [pendingVaccinationResult] = await db
      .select({ count: count() })
      .from(vaccinationReminders)
      .innerJoin(livestock, eq(vaccinationReminders.livestockId, livestock.id))
      .where(
        and(
          eq(livestock.userId, userId),
          eq(vaccinationReminders.isCompleted, false),
          lte(vaccinationReminders.scheduledDate, now)
        )
      );

    // Calculate monthly expenses from health records
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const expenses = await db
      .select({ cost: healthRecords.cost })
      .from(healthRecords)
      .innerJoin(livestock, eq(healthRecords.livestockId, livestock.id))
      .where(
        and(
          eq(livestock.userId, userId),
          gte(healthRecords.recordDate, firstOfMonth)
        )
      );

    const monthlyExpenses = expenses.reduce((sum, record) => {
      return sum + (record.cost ? parseFloat(record.cost) : 0);
    }, 0);

    return {
      totalLivestock: totalLivestockResult.count,
      healthyAnimals: healthyAnimalsResult.count,
      pendingReminders: pendingMedicineResult.count + pendingVaccinationResult.count,
      monthlyExpenses: Math.round(monthlyExpenses * 100) / 100, // Round to 2 decimal places
    };
  }
}

export const storage = new DatabaseStorage();
