import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.PERPLEXITY_API_KEY || "";
// Perplexity is OpenAI-compatible
const perplexity = new OpenAI({
    apiKey,
    baseURL: "https://api.perplexity.ai"
});

export const generatePerplexityResponse = async (
  prompt: string,
  history: string[]
): Promise<string> => {
  if (!apiKey) return "Perplexity API Key is missing.";

  try {
    // Available models: llama-3-sonar-large-32k-online, llama-3-sonar-small-32k-online, etc.
    const modelName = process.env.PERPLEXITY_MODEL || "llama-3-sonar-large-32k-online";
    const systemPrompt = process.env.SYSTEM_PROMPT || 
      "You are a concise LINE assistant. Answer briefly and clearly.";

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Context:\n${history.join("\n")}\n\nUser: ${prompt}`
      }
    ];

    const completion = await perplexity.chat.completions.create({
      messages: messages,
      model: modelName,
    });

    return completion.choices[0]?.message?.content || "No response.";
  } catch (error) {
    console.error("Perplexity API Error:", error);
    return "Error calling Perplexity API.";
  }
};
