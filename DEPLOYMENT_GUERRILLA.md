# ⚡ Operation: Guerrilla Deployment (The 5-Minute Solution)

You have limited time. Deploying to Vercel/Render takes 20+ minutes and often fails with Python errors.
**We will use `ngrok`.** It turns your Localhost into a Public URL instantly.

### ❓ Why this wins Hackathons:
1.  **Zero Build Time:** It runs on your verified working machine.
2.  **Zero Config:** No fighting with `requirements.txt` or Cloud Environment variables.
3.  **Real URL:** You get a `https://...` link to show judges on their phones.

---

### 🚀 Step 1: Install Ngrok (If not installed)
1.  Go to [ngrok.com/download](https://ngrok.com/download).
2.  Download for Windows.
3.  Unzip and run `ngrok.exe`.
4.  (Optional but recommended) Sign up for free account to get a permanent-ish session.

### 🔗 Step 2: Expose Backend (Port 8000)
1.  Open a NEW Terminal.
2.  Run:
    ```powershell
    ngrok http 8000
    ```
3.  Copy the URL (e.g., `https://a1b2-c3d4.ngrok-free.app`). **This is your Public Backend URL.**

### 🔗 Step 3: Connect Frontend to Public Backend
1.  Open `frontend/.env`.
2.  Change `VITE_API_URL` to the Ngrok URL you just copied:
    ```
    VITE_API_URL=https://a1b2-c3d4.ngrok-free.app
    ```
3.  **Restart Frontend:** `Ctrl+C` -> `npm run dev`.

### 🔗 Step 4: Expose Frontend (Port 5173)
1.  Open ANOTHER New Terminal.
2.  Run:
    ```powershell
    ngrok http 5173
    ```
3.  Copy this second URL. **This is your DEMO URL.**
    *   Give THIS link to the judges.

---

## 🎤 The "Hybrid" Story (Connecting BizIntel + Agentforce)

**Judge:** "You have Agentforce Flows and this Dashboard. How do they connect?"

**You:** "They are two sides of the same coin."

| **BizIntel AI (Backend Engine)** | **Agentforce (Frontend Assistant)** |
| :--- | :--- |
| **Actions:** Runs batch jobs (Scanning 1000s of records). | **Actions:** Runs single specific tasks. |
| **Logic:** "If Churn Score > 80, Create Case." | **Logic:** "User says 'Help', run Flow." |
| **Your Demo:** *Click 'Run Now' on Retention Agent.* | **Your Demo:** *Type 'Flag Risk' in Chat.* |
| **Result:** Creates a Case automatically. | **Result:** Creates a Case manually/conversationally. |

**The Automations ARE linked:**
*   BizIntel updates the data (e.g., marks a Lead as "Contacted").
*   Agentforce *sees* that updated data immediately.

**"We are not just creating Tasks. We are managing the entire Lifecycle: Leads (Market Scout), Opportunities (Sales Agent), and Support Cases (Retention Agent)."**
