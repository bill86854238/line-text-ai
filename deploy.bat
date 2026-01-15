@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   Deploying LineTextAI to Google Cloud Functions Gen2
echo ========================================================

:: 1. Check if .env file exists
if not exist .env (
    echo [ERROR] .env file not found! 
    echo Please copy .env.example to .env and fill in your keys.
    pause
    exit /b 1
)

:: 2. Load environment variables from .env
echo [INFO] Loading environment variables...
for /f "usebackq tokens=1* delims==" %%A in (".env") do (
    :: Skip comments and empty lines
    echo %%A | findstr /b /c:"#" >nul
    if errorlevel 1 (
        if "%%A" neq "" (
            set "KEY=%%A"
            set "VAL=%%B"
            :: Remove potential carriage returns and spaces
            set "KEY=!KEY: =!"
            if defined VAL set "VAL=!VAL: =!"
            
            :: Set local variable
            set "!KEY!=!VAL!"
        )
    )
)

:: 3. Execute gcloud deploy command
echo [INFO] Starting deployment...
echo Target Region: asia-northeast1
echo Runtime: nodejs20

call gcloud functions deploy line-text-ai ^
  --gen2 ^
  --runtime=nodejs20 ^
  --region=asia-northeast1 ^
  --source=. ^
  --entry-point=lineWebhook ^
  --trigger-http ^
  --allow-unauthenticated ^
  --set-env-vars LINE_CHANNEL_SECRET=%LINE_CHANNEL_SECRET%,LINE_CHANNEL_ACCESS_TOKEN=%LINE_CHANNEL_ACCESS_TOKEN%,GEMINI_API_KEY=%GEMINI_API_KEY%,GEMINI_MODEL=%GEMINI_MODEL%,SYSTEM_PROMPT="%SYSTEM_PROMPT%",GROQ_API_KEY=%GROQ_API_KEY%,CONTEXT_LIMIT=%CONTEXT_LIMIT%,DEFAULT_AI_PROVIDER=%DEFAULT_AI_PROVIDER%

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Deployment failed. Please check the error message above.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo   [SUCCESS] Deployment Complete!
echo ========================================================
echo.
echo Please copy the URI above and set it as your LINE Webhook URL.
echo.
pause
