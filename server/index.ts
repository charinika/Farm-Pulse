import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { setupAuth } from "./auth";
import routes from "./routes";
import { setupVite } from "./vite"; // your custom vite middleware setup
import { createServer } from "http";
import { createProxyMiddleware } from "http-proxy-middleware"; // ⭐ added

import dashboardRoute from "./routes/dashboard";
import livestockRoutes from "./routes/livestock";
import chatRoute from "./routes/chat";

// after other routes
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Parse JSON
app.use(express.json());

// CORS
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Auth
setupAuth(app);

// Chat route first
app.use("/api/chat", chatRoute);

// General /api routes
app.use("/api", routes);

// Proxy to Flask
app.use(
  "/api/diagnosis",
  createProxyMiddleware({
    target: "http://127.0.0.1:8000",
    changeOrigin: true,
    pathRewrite: { "^/api/diagnosis": "/predict" },
  })
);

// Other API routes
app.use("/api/dashboard", dashboardRoute);
app.use("/api/livestock", livestockRoutes);

// Create HTTP server
const httpServer = createServer(app);

// Setup Vite
setupVite(app, httpServer).then(() => {
  httpServer.listen(port, () => {
    console.log(`🚀 Dev server running at http://localhost:${port}`);
  });
});
