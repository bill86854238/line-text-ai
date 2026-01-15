import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GROQ_API_KEY || "";
const groq = new Groq({ apiKey });

export const generateGroqResponse = async (
  prompt: string,
  history: string[]
): Promise<string> => {
  if (!apiKey) return "Groq API Key is missing.";

  try {
    const systemPrompt = process.env.SYSTEM_PROMPT || 
      "You are a concise LINE assistant. Answer briefly and clearly.";

    const messages: any[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Context:\n${history.join("\n")}\n\nUser: ${prompt}`
      }
    ];

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "mixtral-8x7b-32768",
    });

    return completion.choices[0]?.message?.content || "No response.";
  } catch (error) {
    console.error("Groq API Error:", error);
    return "Error calling Groq API.";
  }
};
