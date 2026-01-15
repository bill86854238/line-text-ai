# LineTextAI - LINE 文字聊天助手

這是一個基於 Node.js 與 Google Cloud Functions (Gen 2) 的輕量級 LINE 聊天機器人。它串接了 Generative AI (Google Gemini / Groq)，提供具備短期記憶的文字對話功能。

## 🚀 功能特色

*   **多模型支援**：預設使用 Google Gemini (可切換 Groq)。
*   **短期記憶**：自動保留最近 5 則對話，讓對話具備上下文。
*   **新對話提示**：當系統冷啟動或記憶重置時，會貼心提醒 `(已開啟新對話)`。
*   **手動重置**：使用者可輸入 `/reset` 或 `/clear` 清空自己的對話紀錄。
*   **過濾機制**：自動擋下貼圖與圖片，僅專注於文字交流。
*   **Serverless 架構**：低成本、高擴展性，無須管理伺服器。

## 📂 專案結構

```
line-text-ai/
├─ src/
│ ├─ handler.ts      # 主程式 (Webhook 入口、邏輯處理)
│ ├─ ai/             # AI API 封裝 (Gemini / Groq)
│ └─ context/        # 記憶體管理 (In-Memory Map)
├─ deploy.bat        # Windows 一鍵部署腳本
├─ package.json
└─ .env.example      # 環境變數範本
```

## 🛠️ 安裝與設定

1.  **安裝依賴**
    ```bash
    npm install
    ```

2.  **設定環境變數**
    複製 `.env.example` 為 `.env`，並填入您的 Key：
    ```ini
    LINE_CHANNEL_SECRET=您的LINE_Secret
    LINE_CHANNEL_ACCESS_TOKEN=您的LINE_Token
    GEMINI_API_KEY=您的Gemini_Key
    
    # 進階設定
    GEMINI_MODEL=gemini-1.5-flash        # 指定模型版本
    SYSTEM_PROMPT="你是親切的 LINE 助手..." # 設定 AI 人設
    CONTEXT_LIMIT=5                      # (目前程式碼鎖定為 5，此變數保留供未來擴充)
    ```

## ☁️ 部署 (Windows)

本專案提供一鍵部署腳本，會自動讀取 `.env` 並上傳至 Google Cloud。

1.  確保已安裝 `gcloud CLI` 並登入。
2.  執行部署腳本：
    ```cmd
    deploy.bat
    ```
3.  部署完成後，將顯示的 **URL** 貼到 LINE Developers Console 的 Webhook 欄位。

## 💡 使用說明

*   **一般對話**：直接傳送文字訊息即可。
*   **重置記憶**：輸入 `/reset` 或 `/clear`。
*   **關於記憶**：由於使用 Serverless 架構，若閒置過久 (約 15 分鐘)，系統重啟後記憶會自動消失，此為正常現象。

## 📝 開發備註

*   **記憶體**：目前使用變數儲存上下文。若需永久儲存或支援大規模多人併發，建議改用 Firestore 或 Redis。
*   **AI 回覆**：若要修改 AI 的語氣或限制回覆長度，請修改 `.env` 中的 `SYSTEM_PROMPT`。