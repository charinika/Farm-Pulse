import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertLivestockSchema,
  insertHealthRecordSchema,
  insertMedicineReminderSchema,
  insertVaccinationReminderSchema,
  insertForumPostSchema,
  insertForumReplySchema,
  insertActivityLogSchema,
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Livestock routes
  app.get("/api/livestock", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const livestock = await storage.getLivestock(userId);
      res.json(livestock);
    } catch (error) {
      console.error("Error fetching livestock:", error);
      res.status(500).json({ message: "Failed to fetch livestock" });
    }
  });

  app.get("/api/livestock/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const animal = await storage.getLivestockById(id, userId);
      
      if (!animal) {
        return res.status(404).json({ message: "Animal not found" });
      }
      
      res.json(animal);
    } catch (error) {
      console.error("Error fetching animal:", error);
      res.status(500).json({ message: "Failed to fetch animal" });
    }
  });

  app.post("/api/livestock", isAuthenticated, upload.single("photo"), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertLivestockSchema.parse({
        ...req.body,
        userId,
        photoUrl: req.file ? `/uploads/${req.file.filename}` : null,
      });
      
      const animal = await storage.createLivestock(validatedData);
      
      // Log activity
      await storage.createActivityLog({
        userId,
        livestockId: animal.id,
        action: "animal_added",
        description: `Added new ${animal.species} named ${animal.name}`,
      });
      
      res.status(201).json(animal);
    } catch (error) {
      console.error("Error creating animal:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create animal" });
      }
    }
  });

  app.put("/api/livestock/:id", isAuthenticated, upload.single("photo"), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const updateData = {
        ...req.body,
        ...(req.file && { photoUrl: `/uploads/${req.file.filename}` }),
      };
      
      const validatedData = insertLivestockSchema.partial().parse(updateData);
      const animal = await storage.updateLivestock(id, validatedData, userId);
      
      if (!animal) {
        return res.status(404).json({ message: "Animal not found" });
      }
      
      res.json(animal);
    } catch (error) {
      console.error("Error updating animal:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update animal" });
      }
    }
  });

  app.delete("/api/livestock/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const success = await storage.deleteLivestock(id, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Animal not found" });
      }
      
      res.json({ message: "Animal deleted successfully" });
    } catch (error) {
      console.error("Error deleting animal:", error);
      res.status(500).json({ message: "Failed to delete animal" });
    }
  });

  // Health records routes
  app.get("/api/livestock/:id/health-records", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const records = await storage.getHealthRecords(id);
      res.json(records);
    } catch (error) {
      console.error("Error fetching health records:", error);
      res.status(500).json({ message: "Failed to fetch health records" });
    }
  });

  app.post("/api/health-records", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertHealthRecordSchema.parse(req.body);
      const record = await storage.createHealthRecord(validatedData);
      
      // Log activity
      const userId = req.user.claims.sub;
      await storage.createActivityLog({
        userId,
        livestockId: validatedData.livestockId,
        action: "health_record_added",
        description: `Added ${validatedData.recordType}: ${validatedData.title}`,
      });
      
      res.status(201).json(record);
    } catch (error) {
      console.error("Error creating health record:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create health record" });
      }
    }
  });

  // Medicine reminders routes
  app.get("/api/medicine-reminders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reminders = await storage.getMedicineReminders(userId);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching medicine reminders:", error);
      res.status(500).json({ message: "Failed to fetch medicine reminders" });
    }
  });

  app.get("/api/medicine-reminders/overdue", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reminders = await storage.getOverdueMedicineReminders(userId);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching overdue reminders:", error);
      res.status(500).json({ message: "Failed to fetch overdue reminders" });
    }
  });

  app.post("/api/medicine-reminders", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertMedicineReminderSchema.parse(req.body);
      const reminder = await storage.createMedicineReminder(validatedData);
      res.status(201).json(reminder);
    } catch (error) {
      console.error("Error creating medicine reminder:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create medicine reminder" });
      }
    }
  });

  app.put("/api/medicine-reminders/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertMedicineReminderSchema.partial().parse(req.body);
      const reminder = await storage.updateMedicineReminder(id, validatedData);
      
      if (!reminder) {
        return res.status(404).json({ message: "Reminder not found" });
      }
      
      res.json(reminder);
    } catch (error) {
      console.error("Error updating medicine reminder:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update medicine reminder" });
      }
    }
  });

  // Vaccination reminders routes
  app.get("/api/vaccination-reminders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reminders = await storage.getVaccinationReminders(userId);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching vaccination reminders:", error);
      res.status(500).json({ message: "Failed to fetch vaccination reminders" });
    }
  });

  app.get("/api/vaccination-reminders/overdue", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reminders = await storage.getOverdueVaccinationReminders(userId);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching overdue vaccination reminders:", error);
      res.status(500).json({ message: "Failed to fetch overdue vaccination reminders" });
    }
  });

  app.post("/api/vaccination-reminders", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertVaccinationReminderSchema.parse(req.body);
      const reminder = await storage.createVaccinationReminder(validatedData);
      res.status(201).json(reminder);
    } catch (error) {
      console.error("Error creating vaccination reminder:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create vaccination reminder" });
      }
    }
  });

  app.put("/api/vaccination-reminders/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertVaccinationReminderSchema.partial().parse(req.body);
      const reminder = await storage.updateVaccinationReminder(id, validatedData);
      
      if (!reminder) {
        return res.status(404).json({ message: "Reminder not found" });
      }
      
      res.json(reminder);
    } catch (error) {
      console.error("Error updating vaccination reminder:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update vaccination reminder" });
      }
    }
  });

  // Disease information routes
  app.get("/api/diseases", async (req, res) => {
    try {
      const { search } = req.query;
      let diseases;
      
      if (search && typeof search === "string") {
        diseases = await storage.searchDiseases(search);
      } else {
        diseases = await storage.getDiseases();
      }
      
      res.json(diseases);
    } catch (error) {
      console.error("Error fetching diseases:", error);
      res.status(500).json({ message: "Failed to fetch diseases" });
    }
  });

  // Forum routes
  app.get("/api/forum/posts", async (req, res) => {
    try {
      const { category } = req.query;
      const posts = await storage.getForumPosts(category as string);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      res.status(500).json({ message: "Failed to fetch forum posts" });
    }
  });

  app.get("/api/forum/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.getForumPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching forum post:", error);
      res.status(500).json({ message: "Failed to fetch forum post" });
    }
  });

  app.post("/api/forum/posts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertForumPostSchema.parse({
        ...req.body,
        userId,
      });
      
      const post = await storage.createForumPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating forum post:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create forum post" });
      }
    }
  });

  app.get("/api/forum/posts/:id/replies", async (req, res) => {
    try {
      const { id } = req.params;
      const replies = await storage.getForumReplies(id);
      res.json(replies);
    } catch (error) {
      console.error("Error fetching forum replies:", error);
      res.status(500).json({ message: "Failed to fetch forum replies" });
    }
  });

  app.post("/api/forum/posts/:id/replies", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const validatedData = insertForumReplySchema.parse({
        ...req.body,
        postId: id,
        userId,
      });
      
      const reply = await storage.createForumReply(validatedData);
      res.status(201).json(reply);
    } catch (error) {
      console.error("Error creating forum reply:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create forum reply" });
      }
    }
  });

  // Activity logs routes
  app.get("/api/activity-logs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { limit } = req.query;
      const logs = await storage.getActivityLogs(userId, limit ? parseInt(limit as string) : 10);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // Dashboard metrics routes
  app.get("/api/dashboard/metrics", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const metrics = await storage.getDashboardMetrics(userId);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(uploadDir));

  const httpServer = createServer(app);
  return httpServer;
}
