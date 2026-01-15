# Deployment Guide

## Prerequisites

1. Google Cloud SDK (`gcloud`) installed and authenticated.
2. A Google Cloud Project created with billing enabled.
3. APIs enabled:
   - Cloud Functions API
   - Cloud Build API
   - Artifact Registry API

## 1. Login and Set Project

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

## 2. Deploy to Cloud Functions (Gen 2)

Run the following command in the root directory:

```bash
gcloud functions deploy line-text-ai \
  --gen2 \
  --runtime=nodejs20 \
  --region=asia-northeast1 \
  --source=. \
  --entry-point=lineWebhook \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars LINE_CHANNEL_SECRET=your_secret,LINE_CHANNEL_ACCESS_TOKEN=your_token,GEMINI_API_KEY=your_key,GROQ_API_KEY=your_key,DEFAULT_AI_PROVIDER=gemini
```

*Note: It is safer to use `--set-env-vars-file .env.yaml` if you have many variables, instead of putting secrets in the CLI command history.*

## 3. Configure LINE Webhook

1. Copy the **httpsTrigger url** provided in the output of the deploy command (e.g., `https://line-text-ai-xyz-an.a.run.app`).
2. Go to the [LINE Developers Console](https://developers.line.biz/).
3. Select your channel.
4. Go to **Messaging API** settings.
5. Paste the URL into **Webhook URL**.
6. Click **Verify**.
7. Enable **Use webhook**.

## Troubleshooting

- **500 Error?** Check Google Cloud Console Logs Explorer.
- **No Reply?** Ensure your LINE Bot has reply permissions and quota.
