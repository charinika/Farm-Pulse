// server/routes/chat.ts
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Gemini client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

router.post("/", async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate a response
    const result = await model.generateContent(message);

    // Extract text reply
    const reply = result.response.text();

    res.json({ reply });
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error);

    res.status(500).json({
      error: "Gemini API Error",
      details: error.message || error.toString(),
    });
  }
});

export default router;
