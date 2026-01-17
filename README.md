# LineTextAI

[English](#english) | [日本語](#日本語) | [繁體中文](#繁體中文)

---

<a name="english"></a>
## 🇺🇸 English

**LineTextAI** is a lightweight LINE Bot built on **Node.js** and **Google Cloud Functions (Gen 2)**. It acts as a bridge to Generative AI models (Google Gemini, Groq, OpenAI, etc.), providing text-based conversation with context retention.

### 💡 Core Value (Why this?)

This project addresses specific scenarios where official apps fall short:

1.  **Bypassing Network Restrictions**
    *   **In-flight Wi-Fi / Corporate Firewalls**: In environments where **only LINE or WhatsApp are whitelisted** (blocking ChatGPT/Gemini web access), this bot allows you to access powerful AI services directly through LINE.
2.  **Data Privacy & Isolation**
    *   **Proxy for Sensitive Data**: Avoid pasting sensitive work chats or internal data directly into the public ChatGPT/Gemini web history. Use this bot as a private middleware to process text without it becoming part of the official platform's user logs.
3.  **Full Autonomy**
    *   **Self-Hosted**: Eliminate the risk of service shutdowns or sudden price hikes.
    *   **Vendor Agnostic**: Switch backend providers (Gemini/Groq/OpenAI) or models instantly via commands.

### 🚀 Features

*   **Multi-Model Support**: Integrated with Google Gemini, Groq, OpenAI (GPT), Anthropic (Claude), and Perplexity.
*   **Context Retention**: Automatically remembers the last 5 messages to maintain conversation flow.
*   **Session Management**: Friendly notification `(New session started)` when memory is reset or after a cold start.
*   **Commands**:
    *   `/reset` or `/clear`: Manually clear conversation history.
    *   `/model`: Check the current model.
    *   `/model <name>`: Switch models (supports `gemini`, `groq`, `gpt`, `claude`, `perplexity`).
*   **Smart Filtering**: Automatically ignores **Stickers** and images, focusing purely on text interactions.
*   **Serverless**: Built on Cloud Functions for low cost, high scalability, and zero server maintenance.

### 🛠️ Installation & Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```
2.  **Configure Environment Variables**
    Copy `.env.example` to `.env` and fill in your API keys:
    ```ini
    LINE_CHANNEL_SECRET=your_line_secret
    LINE_CHANNEL_ACCESS_TOKEN=your_line_token
    GEMINI_API_KEY=your_gemini_key
    # Add other keys as needed (GROQ_API_KEY, OPENAI_API_KEY, etc.)
    ```
3.  **Deploy (Windows)**
    Run the included deployment script:
    ```cmd
    deploy.bat
    ```
    *This script automatically deploys to Google Cloud Functions Gen2 using settings from `.env`.*

---

<a name="日本語"></a>
## 🇯🇵 日本語

**LineTextAI** は、**Node.js** と **Google Cloud Functions (Gen 2)** で構築された軽量な LINE Bot です。Google Gemini や Groq などの **生成AI (Generative AI)** と連携し、文脈（コンテキスト）を理解するテキストチャット機能を提供します。

### 💡 コアバリュー (開発の動機)

このプロジェクトは、公式アプリでは解決できない以下の特定の課題を解決します：

1.  **ネットワーク制限の回避**
    *   **機内 Wi-Fi や社内ファイアウォール**: ChatGPT や Gemini の Web サイトがブロックされ、**LINE や WhatsApp のみが許可されている環境**でも、この Bot を経由することで強力な AI サービスを利用できます。
2.  **データのプライバシー保護と分離**
    *   **業務利用のプロキシ**: 機密性の高い業務チャットやデータを、ChatGPT 等の公式 Web 履歴に残したくない場合に最適です。個人の LINE Bot を「仲介役」とすることで、AI プラットフォーム側のユーザーログに直接データが残るのを防ぎます。
3.  **完全な自律性 (Self-Hosted)**
    *   **サービス終了リスクなし**: 自分でホスティングするため、サードパーティサービスの終了や値上げの影響を受けません。
    *   **柔軟な切り替え**: バックエンド API (Gemini/Groq/OpenAI) やモデルを、コマンド一つで自由に切り替え可能です。

### 🚀 主な機能

*   **マルチモデル対応**: Google Gemini, Groq, OpenAI (GPT), Anthropic (Claude), Perplexity に対応。
*   **短期記憶 (Short-term Memory)**: 直近 5 件の会話を自動的に保持し、自然な文脈で対話できます。
*   **セッション通知**: コールドスタート時や記憶のリセット時に `(新しい対話を開始しました)` と通知し、状態を明確にします。
*   **コマンド操作**:
    *   `/reset` または `/clear`: 会話履歴を手動でクリアします。
    *   `/model`: 現在使用中のモデルを確認します。
    *   `/model <name>`: モデルを切り替えます (`gemini`, `groq`, `gpt`, `claude`, `perplexity` に対応)。
*   **スマートフィルタリング**: **LINE スタンプ (Stamps)** や画像を自動的に無視し、テキストによる対話に集中させます。
*   **サーバーレス**: Google Cloud Functions を採用し、低コストかつスケーラブル。サーバー管理の手間もありません。

### 🛠️ インストールと設定

1.  **依存パッケージのインストール**
    ```bash
    npm install
    ```
2.  **環境変数の設定**
    `.env.example` を `.env` にコピーし、API キーを入力してください：
    ```ini
    LINE_CHANNEL_SECRET=あなたのLINE_Secret
    LINE_CHANNEL_ACCESS_TOKEN=あなたのLINE_Token
    GEMINI_API_KEY=あなたのGemini_Key
    # 必要に応じて他のキーも追加 (GROQ_API_KEY, OPENAI_API_KEY など)
    ```
3.  **デプロイ (Windows)**
    付属のデプロイ用バッチファイルを実行します：
    ```cmd
    deploy.bat
    ```
    *`.env` の設定を読み込み、Google Cloud Functions Gen2 へ自動的にデプロイします。*

---

<a name="繁體中文"></a>
## 🇹🇼 繁體中文

**LineTextAI** 是一個基於 **Node.js** 與 **Google Cloud Functions (Gen 2)** 的輕量級 LINE 聊天機器人。它串接了 Google Gemini、Groq 等生成式 AI，提供具備短期記憶的文字對話功能。

### 💡 核心價值 (Why this?)

本專案旨在解決官方 App 無法觸及的三大場景：

1.  **突破受限網路環境**
    *   在飛機免費 Wi-Fi 或公司內網等 **只允許 LINE / WhatsApp** 通訊軟體的環境下，依然能透過此 Bot 存取強大的 AI 服務，不受官方網頁版被封鎖的限制。
2.  **資料隱私與隔離**
    *   **工作內容的中繼站**：當您不想將敏感的工作對話或資料直接貼入 ChatGPT/Gemini 官方網頁版（以免進入其歷史紀錄）時，可透過私有的 LINE Bot 作為中介進行處理。
3.  **完全自主權**
    *   **自行架設**：無需擔心第三方服務關閉或漲價。
    *   **彈性切換**：隨時更換後端 API (Gemini/Groq/OpenAI) 或模型版本，掌握權在您手中。

### 🚀 功能特色

*   **多模型支援**：支援 Google Gemini, Groq, OpenAI (GPT), Anthropic (Claude), 與 Perplexity。
*   **短期記憶**：自動保留最近 5 則對話，讓 AI 理解上下文。
*   **新對話提示**：當系統冷啟動或記憶重置時，會貼心提醒 `(已開啟新對話)`。
*   **指令系統**：
    *   `/reset` 或 `/clear`：手動清空對話紀錄。
    *   `/model`：查看目前使用的模型。
    *   `/model <name>`：切換模型 (支援 `gemini`, `groq`, `gpt`, `claude`, `perplexity`)。
*   **過濾機制**：自動擋下**貼圖**與圖片，僅專注於文字交流。
*   **Serverless 架構**：低成本、高擴展性，無須管理伺服器。

### 🛠️ 安裝與設定

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
    # 根據需求填入其他 Key
    ```
3.  **部署 (Windows)**
    執行一鍵部署腳本：
    ```cmd
    deploy.bat
    ```