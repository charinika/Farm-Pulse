import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { setupAuth } from "./auth";
import routes from "./routes";
import { setupVite } from "./vite"; 
import { createServer } from "http";
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

// NEW dependencies for Node → Flask
import { spawn } from "child_process";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

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

// --- NEW: Start Flask ML backend ---
const mlBackend = spawn("python", ["predict.py"], {
  cwd: path.join(__dirname, "../ml-backend"),
  stdio: "inherit",
});

mlBackend.on("close", (code) => {
  console.log(`Flask ML backend stopped with code ${code}`);
});

// --- NEW: Absolute uploads path & Multer ---
const UPLOADS_DIR = path.join(__dirname, "../ml-backend/uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const upload = multer({ dest: UPLOADS_DIR });

// --- NEW: Proxy route for image diagnosis ---
app.post("/api/diagnose-image", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    const flaskResponse = await axios.post(
      "http://127.0.0.1:5000/predict",
      formData,
      { headers: formData.getHeaders() }
    );

    res.json(flaskResponse.data);
  } catch (error: any) {
    if (error.response) {
      console.error("Flask response error:", error.response.data);
    } else {
      console.error("Error forwarding request to Flask:", error.message);
    }
    res.status(500).json({ error: "Prediction failed" });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

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
  httpServer.listen(port, () => {
    console.log(`🚀 Dev server running at http://localhost:${port}`);
  });
});