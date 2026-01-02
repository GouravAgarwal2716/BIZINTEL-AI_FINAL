# ⚡ Fast Track Deployment (Zero to Cloud)

Follow these EXACT steps. Do not skip.

## Phase 1: GitHub (The Source)
1.  **Open Terminal** in VS Code.
2.  Run these commands to prepare your code:
    ```powershell
    # 1. Initialize Git
    git init

    # 2. Add files (IGNORE warnings about LF/CRLF)
    git add .

    # 3. Commit
    git commit -m "Initial Launch"
    ```
3.  **Go to GitHub.com:**
    *   Click **+** (Top right) -> **New Repository**.
    *   Name it `bizintel-hackathon`.
    *   **Private** or Public (Doesn't matter).
    *   Click **Create repository**.
4.  **Connect & Push:**
    *   Copy the 3 lines under "…or push an existing repository from the command line".
    *   Paste them into your VS Code Terminal.
    *   *Success:* Logic should say `main -> main`.

## Phase 2: Backend (Render.com)
1.  Go to [dashboard.render.com](https://dashboard.render.com).
2.  **New +** -> **Web Service**.
3.  Connect your `bizintel-hackathon` repo.
4.  **Settings:**
    *   **Name:** `bizintel-api`
    *   **Root Directory:** `backend`  <-- IMPORTANT
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
    *   **Instance Type:** Free
5.  **Environment Variables:** (Copy these from your `backend/.env`)
    *   `SUPABASE_URL`
    *   `SUPABASE_KEY`
    *   `OPENAI_API_KEY`
    *   `PYTHON_VERSION` = `3.11.0`
    *   *(Skip SMTP for now to save time, unless you really need real emails in the cloud demo)*
6.  Click **Create Web Service**.
    *   ⏳ Wait ~5 mins. Copy the URL (e.g., `https://bizintel-api.onrender.com`).

## Phase 3: Frontend (Vercel)
1.  Go to [vercel.com/new](https://vercel.com/new).
2.  Import `bizintel-hackathon`.
3.  **Settings:**
    *   **Framework Preset:** Vite (Should auto-detect)
    *   **Root Directory:** Click Edit -> Select `frontend`.
4.  **Environment Variables:**
    *   `VITE_API_URL` = `[PASTE_RENDER_URL_HERE]` (No trailing slash `/`)
    *   `VITE_SUPABASE_URL` = (Copy from `.env`)
    *   `VITE_SUPABASE_ANON_KEY` = (Copy from `.env`)
5.  Click **Deploy**.

## 🏆 Done.
You now have a live link to share.
