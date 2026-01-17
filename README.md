# LineTextAI - LINE 文字聊天助手

這是一個基於 Node.js 與 Google Cloud Functions (Gen 2) 的輕量級 LINE 聊天機器人。它串接了 Generative AI (Google Gemini / Groq)，提供具備短期記憶的文字對話功能。

## 💡 核心價值 (Why this?)

本專案的價值不在於功能多寡，而在於解決官方 App 無法觸及的三大場景：

1.  **突破受限網路環境**
    *   在飛機免費 Wi-Fi 或公司內網等 **只允許 LINE / WhatsApp** 通訊軟體的環境下，依然能透過此 Bot 存取強大的 AI 服務，不受官方 App 封鎖限制。

2.  **資料隱私與隔離**
    *   **仲介丟檔案、工作聊天室內容**：當您不想將敏感的工作對話或資料貼到 ChatGPT/Gemini 官方網頁版時，透過私有的 LINE Bot 進行處理，資料不會直接進入官方 App 的歷史紀錄中。

3.  **完全自主權**
    *   **可自行架設**：不怕服務收掉或漲價。
    *   **彈性切換**：隨時更換後端 API (Gemini/Groq/OpenAI) 或模型版本，掌握權在您手中。

## 🚀 功能特色

*   **多模型支援**：支援 Google Gemini, Groq, OpenAI (GPT), Anthropic (Claude), 與 Perplexity。
*   **短期記憶**：自動保留最近 5 則對話，讓對話具備上下文。
*   **新對話提示**：當系統冷啟動或記憶重置時，會貼心提醒 `(已開啟新對話)`。
*   **指令系統**：
    *   `/reset` 或 `/clear`：手動清空對話紀錄。
    *   `/model`：查看目前使用的模型。
    *   `/model <name>`：切換模型 (支援 `gemini`, `groq`, `gpt`, `claude`, `perplexity`)。
*   **過濾機制**：自動擋下貼圖與圖片，僅專注於文字交流。
*   **Serverless 架構**：低成本、高擴展性，無須管理伺服器。

## 📂 專案結構

```
line-text-ai/
├─ src/
│ ├─ handler.ts      # 主程式 (Webhook 入口、邏輯處理)
│ ├─ ai/             # AI API 封裝 (Gemini / Groq / GPT / Claude / Perplexity)
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
    
    # AI Keys
    GEMINI_API_KEY=您的Gemini_Key
    GROQ_API_KEY=您的Groq_Key
    OPENAI_API_KEY=您的OpenAI_Key
    ANTHROPIC_API_KEY=您的Anthropic_Key
    PERPLEXITY_API_KEY=您的Perplexity_Key
    
    # 進階設定
    DEFAULT_AI_PROVIDER=gemini           # 預設供應商
    SYSTEM_PROMPT="你是親切的 LINE 助手..." # 設定 AI 人設
    CONTEXT_LIMIT=5                      # 記憶長度
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