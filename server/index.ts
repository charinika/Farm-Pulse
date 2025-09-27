import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { setupAuth } from "./auth";
import routes from "./routes";
import { setupVite } from "./vite"; // your custom vite middleware setup
import { createServer } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import dashboardRoute from "./routes/dashboard";
import livestockRoutes from "./routes/livestock";
import chatRoute from "./routes/chat";
import symptomsRoute from "./routes/symptoms";
import fs from "fs";
import { fileURLToPath } from "url";
import forumRoutes from "./forum";
import nutritionRoute from "./routes/nutrition";
import translateRoute from "./routes/translate";

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "data");

dotenv.config();
const app = express();

// Use the PORT from environment variables (Render sets this)
const PORT = Number(process.env.PORT) || 5000;
const HOST = "0.0.0.0"; // Must be 0.0.0.0 for Render external access

// Parse JSON
app.use(express.json());

// CORS - allow credentials for session cookies
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  })
);

// Auth setup (Passport + session)
setupAuth(app);

// Chat route
app.use("/api/chat", chatRoute);

// General /api routes
app.use("/api", routes);

// Proxy to Flask backend for diagnosis
app.use(
  "/api/diagnosis",
  createProxyMiddleware({
    target: "http://127.0.0.1:8000",
    changeOrigin: true,
    pathRewrite: { "^/api/diagnosis": "/predict" },
    cookieDomainRewrite: "localhost", // ensures cookies from Flask are rewritten
  })
);

// Other API routes
app.use("/api/dashboard", dashboardRoute);
app.use("/api/livestock", livestockRoutes);
app.use("/api/symptoms", symptomsRoute);
app.use("/api/forum", forumRoutes);
app.use("/api/nutrition", nutritionRoute);
app.use("/api/translate", translateRoute);

// Create HTTP server
const httpServer = createServer(app);

// Setup Vite
setupVite(app, httpServer).then(() => {
  httpServer.listen(PORT, HOST, () => {
    console.log(`🚀 Dev server running at http://${HOST}:${PORT}`);
  });
});
