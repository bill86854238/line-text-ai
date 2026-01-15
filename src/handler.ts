import { http, Request, Response } from "@google-cloud/functions-framework";
import * as line from "@line/bot-sdk";
import { memory } from "./context/memory";
import { generateGeminiResponse } from "./ai/gemini";
import { generateGroqResponse } from "./ai/groq";
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

        // 3. Get Context (Last 5 messages)
        const history = memory.getHistory(userId);
        const isNewSession = history.length === 0;

        // 4. Call AI
        let aiResponse = "";
        if (DEFAULT_PROVIDER === "groq") {
            aiResponse = await generateGroqResponse(userMessage, history);
        } else {
            aiResponse = await generateGeminiResponse(userMessage, history);
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