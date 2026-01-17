import { http, Request, Response } from "@google-cloud/functions-framework";
import * as line from "@line/bot-sdk";
import { memory } from "./context/memory";
import { generateGeminiResponse } from "./ai/gemini";
import { generateGroqResponse } from "./ai/groq";
import { generateOpenAIResponse } from "./ai/openai";
import { generateAnthropicResponse } from "./ai/anthropic";
import { generatePerplexityResponse } from "./ai/perplexity";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_PROVIDER = process.env.DEFAULT_AI_PROVIDER || "gemini";

// Setup LINE Client directly here (removed lineHelper)
const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET || "",
};
const client = new line.Client(lineConfig);

http("lineWebhook", async (req: Request, res: Response) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const events: line.WebhookEvent[] = req.body.events;

  if (!events || events.length === 0) {
    res.status(200).send("OK");
    return;
  }

  try {
    await Promise.all(
      events.map(async (event) => {
        // 1. Filter: Only handle Message events
        if (event.type !== "message") {
          return Promise.resolve(null);
        }

        const replyToken = event.replyToken;

        // 2. Filter: Only Text messages
        if (event.message.type !== "text") {
            await client.replyMessage(replyToken, {
                type: "text",
                text: "此助手僅支援文字對話，請輸入文字訊息。"
            });
            return;
        }

        const userId = event.source.userId || "anonymous";
        const userMessage = event.message.text.trim();

        // 2.1 Command: Manual Reset
        if (userMessage === "/reset" || userMessage === "/clear") {
            memory.clear(userId);
            await client.replyMessage(replyToken, {
                type: "text",
                text: "對話記憶已清除。"
            });
            return;
        }

        // 2.2 Command: Switch Model
        if (userMessage.startsWith("/model")) {
            const parts = userMessage.split(" ");
            const currentProvider = memory.getProvider(userId) || DEFAULT_PROVIDER;

            if (parts.length === 1) {
                // Check current model
                await client.replyMessage(replyToken, {
                    type: "text",
                    text: `目前使用的模型: ${currentProvider}`
                });
                return;
            }

            const newProvider = parts[1]?.toLowerCase();
            const validProviders = ["gemini", "groq", "gpt", "claude", "perplexity"];
            
            if (validProviders.includes(newProvider)) {
                memory.setProvider(userId, newProvider);
                await client.replyMessage(replyToken, {
                    type: "text",
                    text: `已切換至 ${newProvider} 模型。`
                });
            } else {
                await client.replyMessage(replyToken, {
                    type: "text",
                    text: `無效的模型名稱。支援的模型: ${validProviders.join(", ")}`
                });
            }
            return;
        }

        // 3. Get Context (Last 5 messages)
        const history = memory.getHistory(userId);
        const isNewSession = history.length === 0;

        // 4. Call AI
        let aiResponse = "";
        const provider = memory.getProvider(userId) || DEFAULT_PROVIDER;

        switch (provider) {
            case "groq":
                aiResponse = await generateGroqResponse(userMessage, history);
                break;
            case "gpt":
                aiResponse = await generateOpenAIResponse(userMessage, history);
                break;
            case "claude":
                aiResponse = await generateAnthropicResponse(userMessage, history);
                break;
            case "perplexity":
                aiResponse = await generatePerplexityResponse(userMessage, history);
                break;
            case "gemini":
            default:
                aiResponse = await generateGeminiResponse(userMessage, history);
                break;
        }

        // 5. Update Context
        memory.addMessage(userId, `User: ${userMessage}`);
        memory.addMessage(userId, `AI: ${aiResponse}`);

        // 6. Reply to LINE
        // If it's a new session, append a notice
        const finalResponse = isNewSession ? `${aiResponse}\n\n(已開啟新對話)` : aiResponse;

        await client.replyMessage(replyToken, {
            type: "text",
            text: finalResponse
        });
      })
    );

    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).send("Internal Server Error");
  }
});