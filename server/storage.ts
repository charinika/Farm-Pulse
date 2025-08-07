// server/storage.ts

import { eq } from "drizzle-orm";
import { db } from "./db";
import { users } from "@shared/schema";
import { InsertUser } from "@shared/schema";

// 🔐 Find user by username
export async function findUserByUsername(username: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  return result[0] || null;
}

// 🔍 Find user by ID
export async function findUserById(id: number) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id));

  return result[0] || null;
}

// 📝 Create a new user
export async function createUser(data: InsertUser) {
  const result = await db.insert(users).values(data).returning();
  return result[0] || null;
}
