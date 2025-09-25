export async function translateText(text: string, target: string, source = "en") {
  if (source === target) return text; // no translation needed

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, source, target }),
    });
    const data = await res.json();
    return data.translated;
  } catch (err) {
    console.error("Translation error:", err);
    return text; // fallback
  }
}
