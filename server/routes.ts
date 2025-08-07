import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = express.Router();

// ✅ Zod schema for validation
const UserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ✅ POST /api/register
router.post("/register", async (req, res) => {
  const result = UserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }

  const { username, password } = result.data;

  try {
    // Check if user already exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert and return full user object
    const insertedUsers = await db
      .insert(users)
      .values({ username, password: hashedPassword })
      .returning(); // returns all columns

    const user = insertedUsers[0];

    // ✅ Log the user in
    req.login(user, (err) => {
      if (err) {
        console.error("Login after registration failed:", err);
        return res.status(500).json({ error: "Login after registration failed" });
      }

      return res.status(201).json({ message: "User registered and logged in" });
    });
  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({ error: "Server error during registration" });
  }
});

// ✅ POST /api/login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || "Login failed" });

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ error: "Login failed" });
      }
      return res.status(200).json({ message: "Login successful" });
    });
  })(req, res, next);
});

// ✅ POST /api/logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout Error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// ✅ GET /api/me
router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json({ user: req.user });
});

export default router;
