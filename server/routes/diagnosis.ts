import express, { Request, Response } from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/diagnose-image", upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const formData = new FormData();
    const filePath = path.resolve(req.file.path);
    formData.append("file", fs.createReadStream(filePath));

    const flaskResponse = await axios.post("http://127.0.0.1:8000/predict", formData, {
      headers: formData.getHeaders(),
    });
    console.log("✅ Flask response received:", flaskResponse.data);

    // ✅ Forward Flask response to frontend
    res.status(200).json(flaskResponse.data);
  } catch (err) {
    console.error("Error forwarding to Flask:", err);
    res.status(500).json({ error: "Flask server error" });
  } finally {
    // ✅ Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
  if (err) console.error("Error deleting file:", err);
});

  }
});

export default router;

