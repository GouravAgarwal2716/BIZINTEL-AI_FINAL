# Agentforce Setup Guide

## Prerequisites
- Salesforce Developer Edition with Agentforce enabled
- Admin access to your org

## Step 1: Enable Agentforce (If Not Already)
1. Go to **Setup** → Search "Agentforce"
2. Click **Agentforce Setup**
3. Enable Agentforce for your org
4. Grant permissions to your user

## Step 2: Create Agent #1 - Onboarding Assistant

### Basic Setup
1. Setup → Agentforce → **New Agent**
2. **Name**: Customer Onboarding Assistant
3. **Description**: Helps onboard new customers by collecting info and tracking progress
4. **Type**: Service Agent

### Configure Topics
Add these topics:
- **New Customer Registration**
  - Intent: "I have a new customer" / "Start onboarding"
  - Action: Create Account record
  
- **Onboarding Status Check**
  - Intent: "What's the status of [customer name]"
  - Action: Query Account with custom field "Onboarding_Stage__c"
  
- **Send Welcome Email**
  - Intent: "Send welcome email to [customer]"
  - Action: Email Alert Flow

### Configure Actions
1. **Create Flow**: "Create_Onboarding_Account"
   - Input: Company Name, Contact Email, Industry
   - Output: Account ID
   - Steps:
     - Create Account record
     - Set Onboarding_Stage__c = "New"
     - Create Task: "Schedule Kickoff Call"

2. **Create Flow**: "Check_Onboarding_Status"
   - Input: Account Name
   - Output: Current stage, Next steps
   - Steps:
     - Query Account by name
     - Return Onboarding_Stage__c and related Tasks

## Step 3: Create Agent #2 - Sales Copilot

### Basic Setup
1. **Name**: Sales Lead Copilot
2. **Description**: Tracks leads and reminds about follow-ups
3. **Type**: Sales Agent

### Configure Topics
- **Show Pending Leads**
  - Intent: "Show me leads needing follow-up"
  - Action: Query Leads where Status = "Open - Not Contacted"
  
- **Convert Lead to Opportunity**
  - Intent: "Convert lead [name]"
  - Action: Lead conversion Flow
  
- **Schedule Follow-up**
  - Intent: "Remind me to follow up with [lead]"
  - Action: Create Task

### Configure Actions
1. **Create Flow**: "Get_Pending_Leads"
   - Query: `SELECT Name, Email, Company FROM Lead WHERE Status = 'Open - Not Contacted' LIMIT 10`
   - Return formatted list

2. **Create Flow**: "Create_Followup_Task"
   - Input: Lead ID, Due Date
   - Create Task linked to Lead

## Step 4: Create Agent #3 - Vendor Manager

### Basic Setup
1. **Name**: Vendor & Contract Manager
2. **Description**: Manages vendor contracts and renewal alerts
3. **Type**: Service Agent

### Configure Topics
- **Upcoming Renewals**
  - Intent: "Show contracts expiring soon"
  - Action: Query Contracts where End_Date < 30 days
  
- **Vendor Status**
  - Intent: "What's the status of [vendor name]"
  - Action: Query Account (RecordType = Vendor)

### Configure Actions
1. **Create Flow**: "Get_Expiring_Contracts"
   - Query: Contracts expiring in next 30 days
   - Send email notification

2. **Create Flow**: "Update_Vendor_Status"
   - Input: Vendor ID, New Status
   - Update Account record

## Step 5: Test Your Agents
1. Open **Agentforce Chat** (bottom right of Salesforce)
2. Type: "Show me leads needing follow-up"
3. Verify agent responds correctly
4. Test all 3 agents

## Step 6: Get Embed Code
1. Setup → Agentforce → **Embedded Chat**
2. Click **Get Code Snippet**
3. Copy the JavaScript snippet
4. **Send this to me** - I'll integrate it into the Dashboard

## Custom Fields Needed (Create These)
- **Account**: `Onboarding_Stage__c` (Picklist: New, In Progress, Complete)
- **Contract**: `Renewal_Alert_Sent__c` (Checkbox)
- **Lead**: `Last_Followup_Date__c` (Date)

## Tips
- Start simple - get 1 topic working per agent first
- Use Salesforce Flows (not Apex) for actions - easier to configure
- Test in Salesforce chat before embedding
