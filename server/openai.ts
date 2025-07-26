import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function createChatCompletion(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response");
  }
}

export function createSystemPrompt(): string {
  return `You are FarmCare AI, a helpful assistant specialized in livestock health management. You help farmers with:

- Animal health advice and diagnosis
- Veterinary care recommendations
- Nutrition and feeding guidance
- Breeding and reproduction advice
- Farm management best practices
- Disease prevention and treatment
- Emergency protocols

Always provide practical, actionable advice. When discussing health issues, always recommend consulting with a veterinarian for serious conditions. Be helpful, knowledgeable, and supportive of farmers' needs.

Keep responses clear and concise. If asked about specific medical treatments, remind users to consult with a licensed veterinarian for proper diagnosis and treatment.`;
}