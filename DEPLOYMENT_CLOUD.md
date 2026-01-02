# ☁️ Cloud Deployment Guide (The "Real" Way)

You chose the Hard Path (Vercel + Render). Here is how to survive it.

---

## 🐍 Backend Deployment (Render.com)
**Goal:** Specific URL for your Python API (e.g., `https://bizz-api.onrender.com`).

1.  **Push Code to GitHub:**
    *   Initialize git if you haven't: `git init`, `git add .`, `git commit -m "deploy"`
    *   Push to a new GitHub repo.

2.  **Create Service on Render:**
    *   Go to [dashboard.render.com](https://dashboard.render.com) -> New -> Web Service.
    *   Connect your GitHub Repo.
    *   **Root Directory:** `backend` (Important!)
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

3.  **Environment Variables (CRITICAL):**
    *   Copy *everything* from your `backend/.env` and paste it into the "Environment" tab in Render.
    *   **Add one more:** `PYTHON_VERSION` = `3.11.0` (to match your local).

4.  **Deploy:** Click "Create Web Service". Wait 5 mins.
    *   *Result:* Copy the URL (e.g., `https://bizz-api.onrender.com`).

---

## ⚛️ Frontend Deployment (Vercel)
**Goal:** The UI that calls your API.

1.  **Create Project on Vercel:**
    *   Go to [vercel.com/new](https://vercel.com/new).
    *   Import the same GitHub Repo.

2.  **Configure:**
    *   **Root Directory:** `frontend` (Click Edit -> Select `frontend` folder).
    *   **Build Command:** `npm run build` (Default is fine).
    *   **Output Directory:** `dist` (Default is fine).

3.  **Environment Variables:**
    *   Name: `VITE_API_URL`
    *   Value: `[YOUR_RENDER_BACKEND_URL]` (e.g., `https://bizz-api.onrender.com`)
    *   *Note: Do NOT put a slash `/` at the end.*

4.  **Deploy:** Click "Deploy".
    *   *Result:* You get a live `https://bizz-frontend.vercel.app` URL.

---

## 🎭 The "Missing Chatbot" Strategy
**Scenario:** The Agentforce Widget (Embedded Chat) fails to load on the Vercel URL (because Salesforce blocks unknown domains by default).

**The Pivot (How to demo anyway):**
1.  **Acknowledge it (Briefly):** *"We have the Agentforce widget integrated here, but for the safest demo experience, I'm going to switch to the Salesforce Developer Console."*
2.  **Switch Screens:** Go to the **Agentforce Service Agent** page in Salesforce Setup (where the Simulator is).
3.  **Narrative:** *"This is the brain of the Agent. The widget on the site is just a window. This is the Control Room."*
4.  **Proceed:** Run your chat demos (Lead task, Market News) right there in the Simulator.
    *   *It counts exactly the same for judges.* They care about the *Logic*, not the HTML iframe.
