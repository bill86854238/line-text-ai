# LineTextAI - LINE Text Chat Assistant

A serverless LINE Bot that uses Generative AI (Google Gemini or Groq) to chat with users, maintaining a short-term memory context. Built with Node.js and deployable to Google Cloud Functions (Gen 2).

## Features

- **Multi-Model Support:** Easily switch between Google Gemini and Groq (Llama/Mixtral).
- **Context Awareness:** Remembers the last 5-10 messages for natural conversation.
- **Serverless:** Runs on Google Cloud Functions (low cost, high scalability).
- **TypeScript:** Fully typed codebase.

## Project Structure

```
line-text-ai/
├─ src/
│ ├─ handler.ts      # Main entry point (Webhook)
│ ├─ ai/             # AI wrappers
│ ├─ context/        # Memory management
│ └─ utils/          # LINE SDK helpers
├─ package.json
└─ deploy.md
```

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your keys:
   - `LINE_CHANNEL_SECRET` & `ACCESS_TOKEN`: From LINE Developers Console.
   - `GEMINI_API_KEY`: From Google AI Studio.
   - `GROQ_API_KEY`: From Groq Console.

3. **Local Development**
   ```bash
   # Run in watch mode
   npm run dev
   ```
   Use `ngrok` to expose port 8080 to test with LINE Webhook URL.

## Deployment

See [deploy.md](./deploy.md) for Google Cloud Functions deployment instructions.

## Notes

- **Memory:** The current implementation uses in-memory storage. On Cloud Functions, this memory is ephemeral (reset on cold start). For production use requiring persistent long-term memory, integrate Firestore or Redis in `src/context/memory.ts`.
