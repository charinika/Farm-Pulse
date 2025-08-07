import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { setupAuth } from "./auth";
import routes from "./routes";
import { setupVite } from "./vite"; // your custom vite middleware setup
import { createServer } from "http";

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

// Create HTTP server from Express app
const httpServer = createServer(app);

// Setup Vite dev server middleware (async)
setupVite(app, httpServer).then(() => {
  httpServer.listen(port, () => {
    console.log(`🚀 Dev server running at http://localhost:${port}`);
  });
});
