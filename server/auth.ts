import { Express } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { db, pool } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { InferModel } from "drizzle-orm";

export type User = InferModel<typeof users>;

// Setup passport local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const result = await db.select().from(users).where(eq(users.username, username));
      const user = result[0];

      if (!user) return done(null, false, { message: "Incorrect username." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: "Incorrect password." });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize user to session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const result = await db.select().from(users).where(eq(users.id, id));
    const user = result[0];
    if (!user) return done(new Error("User not found"), null);
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
});

// ✅ Export setup function
export function setupAuth(app: Express) {
  const PgSession = pgSession(session);

  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "session",
      }),
      secret: process.env.SESSION_SECRET || "dev-secret",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
}
