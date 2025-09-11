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

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // your Vite frontend origin
    credentials: true,
  })
);

app.use(express.json());

// Setup authentication middleware
setupAuth(app);

// Setup API routes under /api
app.use("/api", routes);

// ⭐ Proxy: forward /api/diagnosis requests to Flask backend
app.use(
  "/api/diagnosis",
  createProxyMiddleware({
    target: "http://127.0.0.1:8000", // Flask backend URL
    changeOrigin: true,
    pathRewrite: {
      "^/api/diagnosis/diagnose-image": "/predict",
    },
  })
);

// Other API routes
app.use("/api/dashboard", dashboardRoute);
app.use("/api/livestock", livestockRoutes);

// Create HTTP server from Express app
const httpServer = createServer(app);

// Setup Vite dev server middleware (async)
setupVite(app, httpServer).then(() => {
  httpServer.listen(port, () => {
    console.log(`🚀 Dev server running at http://localhost:${port}`);
  });
});
