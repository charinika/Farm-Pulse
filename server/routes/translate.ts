import { Router } from "express";

const router = Router();

interface LibreTranslateResponse {
  translatedText: string;
}

router.post("/", async (req, res) => {
  const { text, source, target } = req.body;

  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source,
        target,
        format: "text",
      }),
    });

    // ✅ tell TS the type
    const data: LibreTranslateResponse = await response.json() as LibreTranslateResponse;

    res.json({ translated: data.translatedText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;
