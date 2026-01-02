# 🎯 COMPLETE AGENTFORCE SETUP - Final Steps

## What We Just Built

I've created **3 webhook endpoints** that Agentforce will call:

1. `/agentforce/trigger/lead-followup` - Handles lead follow-ups
2. `/agentforce/trigger/onboarding` - Handles customer onboarding  
3. `/agentforce/trigger/contract-renewal` - Handles contract renewals

**These are now live in your backend!**

---

## Your Next Steps (30 Minutes Total)

### Step 1: Restart Backend (2 min)

1. Stop your backend (Ctrl+C in terminal)
2. Restart: `uvicorn main:app --reload`
3. Verify it starts without errors

### Step 2: Test Dashboard (3 min)

1. Open BizIntel AI (http://localhost:5173)
2. Go to Command Center
3. **Should see your data** (if not, hard refresh: Ctrl+Shift+R)
4. Verify connection status shows "Connected"

### Step 3: Create Agentforce Agent in Salesforce (20 min)

**Login to Salesforce:**
- URL: https://login.salesforce.com
- Username: lukabrsam05733@agentforce.com
- Password: Luke$7799

**Create Agent:**

1. Click **Setup** (gear icon)
2. Search: **"Einstein"** or **"Agentforce"** or **"Bots"**
3. Click **"Einstein Bots"** or **"Agentforce Agent Builder"**
4. Click **"New Bot"** or **"New Agent"**
5. Name: `BizIntel Assistant`
6. Description: `Automates lead management and onboarding`
7. Click **"Create"**

**Add Dialog/Topic:**

1. Click **"Add Dialog"** or **"Add Topic"**
2. Name: `Lead Followup`
3. **Intent Utterances** (what users will say):
   - "follow up with leads"
   - "process new leads"
   - "update lead status"

4. **Action** - Choose **"Apex"** or **"HTTP Callout"**:
   - If **HTTP Callout**:
     - Method: `POST`
     - URL: `http://localhost:8000/agentforce/trigger/lead-followup`
     - Headers: `Authorization: Bearer {!$User.SessionId}`
   
   - If **Apex** (create simple Apex class):
     ```apex
     public class LeadFollowupAction {
         @InvocableMethod
         public static void followupLeads() {
             // Call BizIntel AI webhook
             HttpRequest req = new HttpRequest();
             req.setEndpoint('http://localhost:8000/agentforce/trigger/lead-followup');
             req.setMethod('POST');
             Http http = new Http();
             HttpResponse res = http.send(req);
         }
     }
     ```

5. **Response Message**:
   - "✅ Processed leads successfully! Check BizIntel AI dashboard for details."

6. Click **"Save"** and **"Activate"**

### Step 4: Test Agentforce (5 min)

1. Look for **Einstein Bot** or **Agentforce Chat** icon (bottom-right of Salesforce)
2. Click it
3. Type: **"follow up with leads"**
4. **Expected**: Bot responds with success message
5. **Verify**: Go to Tasks tab in Salesforce → See new tasks created!

---

## If You Can't Find Agentforce/Einstein

**Alternative: Use Flow Instead**

1. Setup → **"Flows"**
2. Click **"New Flow"**
3. Choose **"Screen Flow"**
4. Add **"Action"** element
5. Choose **"HTTP Callout"** (if available) or **"Apex"**
6. Configure to call: `http://localhost:8000/agentforce/trigger/lead-followup`
7. Save as **"Lead_Followup_Flow"**
8. **Activate**
9. Test by running the flow manually

---

## Demo Script (When Everything Works)

**Scenario: Show judges the complete workflow**

1. **Open BizIntel AI Dashboard**
   - "This is our platform connected to Salesforce"
   - Show metrics

2. **Open Salesforce in another tab**
   - Show current Tasks (should be some from earlier)

3. **Trigger Agentforce** (choose one):
   - **Option A**: Use Salesforce chat → Type "follow up with leads"
   - **Option B**: Run the Flow manually
   - **Option C**: Call webhook directly via Postman/curl

4. **Show Results**:
   - Salesforce → Tasks tab → **New tasks appeared!**
   - Salesforce → Leads tab → **Stages updated!**
   - BizIntel AI → Agentforce Dashboard → **Activity feed updated!**

5. **Explain Architecture**:
   - "Agentforce understands user intent"
   - "BizIntel AI executes complex automation"
   - "Together they solve all 3 problem statements"

---

## Backup Plan (If Agentforce Setup Takes Too Long)

**You can demo WITHOUT Agentforce chat:**

1. Show BizIntel AI dashboard
2. Go to Agent Console → Run agents manually
3. Show tasks created in Salesforce
4. **Say**: "In production, Agentforce would trigger these agents via chat. We've built the webhook infrastructure ready for integration."

**This is still impressive!** You have:
- ✅ Working Salesforce integration
- ✅ Automated task creation
- ✅ Lead stage management
- ✅ Professional UI
- ✅ Analytics dashboard

---

## Time Check

**How much time until hackathon?**
- If < 1 hour → Skip Agentforce setup, use backup plan
- If 1-2 hours → Try quick Agentforce setup (20 min)
- If > 2 hours → Do full Agentforce integration

**What do you want to do?**
