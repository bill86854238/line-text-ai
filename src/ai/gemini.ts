import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const generateGeminiResponse = async (
  prompt: string,
  history: string[]
): Promise<string> => {
  if (!apiKey) return "Gemini API Key is missing.";

  try {
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const systemPrompt = process.env.SYSTEM_PROMPT || 
      "You are a concise LINE assistant. Keep your answers short, clear, and to the point. Avoid long explanations unless asked.";

    // Concise System Prompt
    const contextPrompt = `
${systemPrompt}

Recent Context:
${history.join("\n")}

User: ${prompt}
Assistant:
    `.trim();

    const result = await model.generateContent(contextPrompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error calling Gemini API.";
  }
};
