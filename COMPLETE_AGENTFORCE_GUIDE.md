# 🎯 Complete Agentforce Integration Guide
## The Complete Workflow: Website → Agentforce → Salesforce → Website

### Overview
You'll create a Salesforce Agentforce agent that calls your BizIntel AI webhooks to perform automation, then displays results back to the user.

---

## Part 1: What You Already Have ✅

**Backend Webhooks** (Already created):
- `/agentforce/trigger/lead-followup` - Processes leads
- `/agentforce/trigger/onboarding` - Handles onboarding
- `/agentforce/trigger/contract-renewal` - Manages contracts

**Each webhook**:
1. Connects to Salesforce
2. Performs automation (creates tasks, updates records)
3. Returns JSON response

---

## Part 2: Create Agentforce Agent in Salesforce (30 min)

### Step 1: Access Agentforce

1. Login to Salesforce: https://login.salesforce.com
   - Username: `lukabrsam05733@agentforce.com`
   - Password: `Luke$7799`

2. Click **Setup** (gear icon, top right)

3. In Quick Find, search: **"Einstein Bots"** or **"Agentforce"**

4. If you see **"Einstein Bots"** → Click it
   - If you see **"Agentforce Agent Builder"** → Even better, click it

### Step 2: Create Bot/Agent

1. Click **"New Bot"** or **"New Agent"**

2. Fill in:
   - **Name**: `BizIntel Assistant`
   - **Description**: `Automates lead management via BizIntel AI`
   - **API Name**: `BizIntel_Assistant` (auto-generated)

3. Click **"Create"** or **"Next"**

### Step 3: Create Dialog/Topic

1. In the bot builder, click **"Add Dialog"** or **"Add Topic"**

2. **Dialog Name**: `Lead Followup`

3. **Intent Configuration**:
   - Add sample utterances (what users will say):
     - "follow up with leads"
     - "process new leads"
     - "update lead status"
     - "check pending leads"

4. Click **"Save"**

### Step 4: Add Action (CRITICAL STEP)

**Option A: If you have "Apex Action" available:**

1. Create Apex Class first:
   - Setup → Apex Classes → New
   - Paste this code:

```apex
public class BizIntelWebhook {
    @InvocableMethod(label='Trigger Lead Followup')
    public static List<String> triggerLeadFollowup() {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('http://localhost:8000/agentforce/trigger/lead-followup');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        
        // Note: In production, use Named Credentials for auth
        // For demo, we'll call without auth (you'll need to temporarily disable auth)
        
        Http http = new Http();
        HttpResponse res = http.send(req);
        
        List<String> results = new List<String>();
        if (res.getStatusCode() == 200) {
            results.add('Success: ' + res.getBody());
        } else {
            results.add('Error: ' + res.getStatus());
        }
        return results;
    }
}
```

2. Save and go back to Bot Builder

3. In your Dialog, add **"Action"** element

4. Select **"Apex Action"** → Choose `BizIntelWebhook.triggerLeadFollowup`

5. Add **"Message"** element after action:
   - Text: "✅ Processed leads successfully! {!Action.Output}"

**Option B: If you have "Flow" available:**

1. Setup → Flows → New Flow

2. Choose **"Autolaunched Flow"**

3. Add **"HTTP Callout"** element (if available)
   - URL: `http://localhost:8000/agentforce/trigger/lead-followup`
   - Method: POST

4. Save as `Lead_Followup_Flow`

5. Activate

6. Go back to Bot Builder → Add Action → Select this Flow

**Option C: Simplified (No external call):**

1. In Dialog, just add **"Message"** element:
   - "Processing leads... (Demo: In production, this would call BizIntel AI webhook)"

2. For demo purposes, you'll manually trigger the webhook from Postman

### Step 5: Activate Bot

1. Click **"Activate"** button (top right)

2. Choose deployment channel:
   - **"Embedded Service"** (for website chat)
   - **"Messaging"** (for Salesforce chat)

3. For quick demo, choose **"Messaging"**

4. Click **"Activate"**

---

## Part 3: Test the Complete Workflow

### Test Method 1: Via Salesforce Chat (If Bot is Active)

1. Look for chat icon in Salesforce (bottom-right)

2. Click it

3. Type: **"follow up with leads"**

4. Bot should respond

5. **Verify**:
   - Go to Salesforce Tasks → See new tasks
   - Go to Leads → See updated stages
   - Go to BizIntel AI → Agentforce Dashboard → See activity

### Test Method 2: Manual Webhook Call (Backup)

1. Open Postman or use curl:

```bash
curl -X POST http://localhost:8000/agentforce/trigger/lead-followup \
  -H "Authorization: Bearer YOUR_TOKEN"
```

2. **Verify same results** as above

---

## Part 4: Embed Chat Widget in BizIntel AI (Optional - 15 min)

### Get Embed Code

1. Setup → **"Embedded Service Deployments"**

2. Click **"New Deployment"**

3. Select your bot: `BizIntel Assistant`

4. Configure:
   - Site URL: `http://localhost:5173`
   - Button text: "Chat with BizIntel AI"

5. Click **"Get Code"**

6. **Copy the entire `<script>` tag**

### Send Me the Code

Paste the embed code here, and I'll integrate it into your Dashboard.

---

## Part 5: Demo Flow (5 Minutes)

### Setup (Before Demo)

1. Have 3 browser tabs open:
   - Tab 1: BizIntel AI Dashboard
   - Tab 2: Salesforce (logged in)
   - Tab 3: Salesforce Tasks view

2. Ensure you have seeded data

### Demo Script

**[1 min] Introduction**
- "BizIntel AI bridges Salesforce Agentforce with advanced automation"
- Show Dashboard → Connected status

**[1 min] Show Current State**
- Salesforce → Show existing leads (status: "Open - Not Contacted")
- Salesforce → Show current tasks (should be some from earlier)

**[2 min] Trigger Automation**
- **Option A**: Salesforce chat → Type "follow up with leads"
- **Option B**: BizIntel AI → Agent Console → Click "Run Sales Agent"
- **Option C**: Call webhook via Postman (show the curl command)

**[1 min] Show Results**
- Salesforce → Tasks → **New tasks created!**
- Salesforce → Leads → **Stages updated to "Working - Contacted"!**
- BizIntel AI → Agentforce Dashboard → **Activity feed shows actions!**

**[30s] Explain Value**
- "Agentforce handles user intent"
- "BizIntel AI executes complex workflows"
- "Salesforce gets updated automatically"
- "Platform shows analytics Agentforce can't provide"

---

## Troubleshooting

**"Can't find Einstein Bots/Agentforce"**
→ Your org might not have it enabled. Use backup demo (manual agent execution)

**"HTTP Callout not working"**
→ Salesforce blocks localhost. Use ngrok to expose your backend:
```bash
ngrok http 8000
# Use the https URL in Apex/Flow
```

**"Authentication failed"**
→ Temporarily disable auth check in webhook for demo, or use Salesforce Named Credentials

---

## Success Criteria

✅ Bot responds to "follow up with leads"
✅ Tasks created in Salesforce
✅ Lead stages updated
✅ Activity visible in BizIntel AI dashboard

**You're ready to win the hackathon!** 🏆
