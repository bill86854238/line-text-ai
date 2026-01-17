import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.ANTHROPIC_API_KEY || "";
const anthropic = new Anthropic({ apiKey });

export const generateAnthropicResponse = async (
  prompt: string,
  history: string[]
): Promise<string> => {
  if (!apiKey) return "Anthropic API Key is missing.";

  try {
    const modelName = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20240620";
    const systemPrompt = process.env.SYSTEM_PROMPT || 
      "You are a concise LINE assistant. Answer briefly and clearly.";

    const message = `Context:\n${history.join("\n")}\n\nUser: ${prompt}`;

    const msg = await anthropic.messages.create({
      model: modelName,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        { role: "user", content: message }
      ],
    });

    // Anthropic's response content is an array of content blocks. 
    // Usually text is the first block.
    const textBlock = msg.content[0];
    if (textBlock.type === 'text') {
        return textBlock.text;
    }
    return "No text response.";

  } catch (error) {
    console.error("Anthropic API Error:", error);
    return "Error calling Anthropic API.";
  }
};
