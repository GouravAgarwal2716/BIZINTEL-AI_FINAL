# BizIntel AI - The Master Demo Guide 🏆

This guide explains your fully integrated "Autonomous Revenue Platform". You have two powerful ways to demonstrate value:

1.  **BizIntel Dashboard ("The General"):** Automates heavy backend processes (finding leads, churn risk) in batches.
2.  **Agentforce Assistant ("The Scout"):** Handles real-time, ad-hoc requests via chat.

---

## Part 1: The "Auto-Pilot" Demo (BizIntel Dashboard) 🕹️
**Narrative:** *"First, let me show you how BizIntel proactively manages your CRM 24/7."*

### Step 1: Run the "Sales Agent"
1.  Open your Local Dashboard: `http://localhost:5173/agents`.
2.  Find the **Sales Agent** card.
3.  Click **"Run Now"**.
4.  **Watch the Log Panel (Right Side):**
    *   It will find Leads with status `Open - Not Contacted`.
    *   It will "Calculate Einstein Score" (Simulation).
    *   It will **Create a Task** in Salesforce.
    *   It will **Send an Email** (Logged).
5.  **Proof:** Go to Salesforce -> **Tasks** Tab -> See "AI Outreach: [Lead Name]".

### Step 2: Run the "Retention Agent"
1.  On the Dashboard, click **"Run Now"** on **Retention Agent**.
2.  **Watch the Log Panel:**
    *   It analyzes Accounts (simulating low usage).
    *   It **Creates a Case** in Salesforce.
3.  **Proof:** Go to Salesforce -> **Cases** Tab -> See "Churn Risk Alert".

---

## Part 2: The "Assistant" Demo (Agentforce Chat) 💬
**Narrative:** *"Now, what if a sales rep needs to take immediate action manually? They talk to the Agent."*

### Step 3: Create a Task (The Executor)
1.  Open **Agentforce Simulator** (or your Chat Widget).
2.  Type: `Create a task to call Global Media about the contract renewal.`
3.  **Agent:** "Task created successfully."
4.  **Proof:** Go to Salesforce -> **Tasks** Tab -> See the new task.

### Step 4: Flag Risk (The Guardian)
1.  Type: `Flag Burlington Textiles as high risk`.
2.  **Agent:** "Account flagged as High Risk successfully."
3.  **Proof:**
    *   Go to Salesforce -> **Accounts** -> Burlington Textiles.
    *   Check **Rating**: `Cold`.
    *   Check **Description**: `⚠️ CHURN RISK DETECTED...`.

---

## System Architecture 🏗️

| Component | Responsibility | Tech Stack |
| :--- | :--- | :--- |
| **BizIntel Dashboard** | Batch Processing, High-Volume Logic, Audits | React + Python (FastAPI) |
| **Agentforce** | Natural Language Interface, Single-Record Actions | Salesforce Agent + Flows |
| **Salesforce** | The Database & System of Record | CRM Data (Leads, Cases) |

---

## Troubleshooting 🔧
*   **"No Data Available" Error:** Usually means the Flow couldn't find the record (e.g., you typed a company name that doesn't exist). *Always use real record names.*
*   **Agent Logic:** If the Dashboard agent does nothing, check that you have Leads with status `Open - Not Contacted`.
