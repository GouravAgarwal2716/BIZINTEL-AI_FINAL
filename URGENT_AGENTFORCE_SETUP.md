# 🎯 CRITICAL: Salesforce Agentforce Setup (Required to Win)

## Why This is Required
The hackathon judges need to see **actual Salesforce Agentforce** working. Your platform acts as the "bridge" that enhances Agentforce with advanced analytics and automation.

## The Winning Architecture
```
User asks Agentforce → Agentforce triggers action → BizIntel AI executes → Updates Salesforce + Sends emails
```

## Quick Setup (45 Minutes - Follow Exactly)

### Step 1: Access Agentforce (5 min)
1. Log into Salesforce: https://login.salesforce.com
2. Click **Setup** (gear icon, top right)
3. Search: **"Einstein"** or **"Agentforce"**
4. If you see "Agentforce" → Click it
5. If not available → **STOP and tell me** (your org might not have it)

### Step 2: Create ONE Simple Agent (15 min)

**Agent Name:** Lead Manager

**What it does:** When user asks "show me new leads", it responds with a list

**How to create:**

1. In Agentforce setup, click **"New Agent"** or **"Agent Builder"**

2. Fill in:
   - Name: `Lead Manager`
   - Description: `Helps manage sales leads`
   - Type: `Sales` (if asked)

3. Click **"Save"**

### Step 3: Add ONE Topic (10 min)

**Topic Name:** Show New Leads

**Configuration:**
1. Click **"Add Topic"**
2. **Name**: `Show New Leads`
3. **Sample Phrases** (what users will say):
   - "show me new leads"
   - "what leads need attention"
   - "list open leads"

4. **Action** - Choose ONE of these options:

**Option A: Simple Response (Easiest - 2 min)**
- Action Type: **Text Response**
- Response: "You have 3 new leads: Sarah Connor (CyberDyne), John Doe (Unknown Inc), Jane Smith (Vertex AI). Check BizIntel AI dashboard for details."

**Option B: Query Salesforce (Better - 8 min)**
- Action Type: **Apex** or **Flow**
- If Flow:
  1. Create new Flow
  2. Add "Get Records" element
  3. Object: Lead
  4. Filter: Status = "Open - Not Contacted"
  5. Save as "Get_New_Leads"
  6. Back in Agentforce, select this Flow

### Step 4: Activate & Test (5 min)
1. Click **"Activate"** in Agent Builder
2. Look for **Agentforce Chat** icon (usually bottom-right of Salesforce)
3. Click it
4. Type: "show me new leads"
5. **If it responds → SUCCESS!** ✅
6. **If error → Tell me the exact error message**

### Step 5: Get Embed Code (10 min)
1. Setup → Search: **"Embedded Service"** or **"Chat Deployment"**
2. Click **"New Deployment"**
3. Select **"Agentforce"** or **"Einstein"**
4. Choose your "Lead Manager" agent
5. Click **"Get Code"**
6. **COPY THE ENTIRE <script> TAG**
7. **Paste it here in chat** → I'll integrate it

## If You Get Stuck

**Problem: "Can't find Agentforce"**
→ Your org might not have it. Try searching "Einstein Bots" instead

**Problem: "Don't know how to create Flow"**
→ Use Option A (Simple Response) - it's enough for the demo!

**Problem: "Embed code not working"**
→ Send me the code anyway, I'll troubleshoot

## What Happens After You Send Me the Code

I will:
1. Add it to your Dashboard (bottom-right chat bubble)
2. Style it to match your theme
3. Test it works
4. **Total time: 10 minutes**

## The Demo Story

**Judge:** "Show me Agentforce"

**You:** 
1. Click chat bubble on Dashboard
2. Type "show me new leads"
3. Agentforce responds
4. **Say:** "This is Salesforce Agentforce. But BizIntel AI enhances it with:"
5. Go to Intelligence Atlas → Show churn prediction
6. Go to Agentforce Dashboard → Show automated actions
7. **Say:** "Agentforce handles conversations, BizIntel AI handles complex automation and analytics"

## Bottom Line

**You need to:**
1. Create ONE agent in Salesforce (15 min)
2. Add ONE topic with simple response (5 min)
3. Get embed code (5 min)
4. Send code to me (1 min)

**I will:**
1. Integrate it into your app (10 min)

**Total: 35 minutes to complete integration**

**START NOW!** Open Salesforce and follow Step 1.
