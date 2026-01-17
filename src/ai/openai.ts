import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY || "";
const openai = new OpenAI({ apiKey });

export const generateOpenAIResponse = async (
  prompt: string,
  history: string[]
): Promise<string> => {
  if (!apiKey) return "OpenAI API Key is missing.";

  try {
    const modelName = process.env.OPENAI_MODEL || "gpt-4o";
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

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: modelName,
    });

    return completion.choices[0]?.message?.content || "No response.";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "Error calling OpenAI API.";
  }
};
