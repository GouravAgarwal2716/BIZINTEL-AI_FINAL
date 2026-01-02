# 🔐 How to Get Your Salesforce Security Token

## What You Have
- Username: `lukabrsam05733@agentforce.com`
- Password: `Luke$7799`
- **Missing: Security Token** ⚠️

## What is a Security Token?
A security token is an extra password that Salesforce requires for API access. You need it to connect from BizIntel AI.

## How to Get It (5 Minutes)

### Step 1: Login to Salesforce
1. Go to: **https://login.salesforce.com**
2. Enter:
   - Username: `lukabrsam05733@agentforce.com`
   - Password: `Luke$7799`
3. Click **"Log In"**

### Step 2: Reset Security Token
1. Once logged in, click your **profile picture** (top right)
2. Click **"Settings"**
3. In the left sidebar, click **"Reset My Security Token"**
4. Click **"Reset Security Token"** button
5. **Check your email** (lukabrsam05733@agentforce.com)
6. You'll receive an email with subject: "Your new Salesforce security token"
7. **Copy the token** from the email (it looks like: `AbCdEfGhIjKlMnOpQrSt`)

### Step 3: Connect in BizIntel AI
1. Open your BizIntel AI dashboard
2. Go to **Settings** page (or `/connect` page)
3. Enter:
   - **Username**: `lukabrsam05733@agentforce.com`
   - **Password**: `Luke$7799`
   - **Security Token**: `[paste the token from email]`
   - **Domain**: `login` (keep default)
4. Click **"Connect"**

## If You Can't Access the Email

**Option 1: Ask Your Friend**
Send this message:
```
Hey! Can you check the email lukabrsam05733@agentforce.com?
There should be a "Salesforce Security Token" email.
Send me the token (long random string).
Need it for the hackathon!
```

**Option 2: Enable SOAP API (If Admin)**
If your friend is the admin:
1. Setup → Search "API"
2. Enable "SOAP API"
3. You won't need the security token

**Option 3: Create Your Own Org**
- Go to https://developer.salesforce.com/signup
- Create free developer org (10 min)
- Full control, no dependencies

## Quick Checklist

- [ ] Login to Salesforce with provided credentials
- [ ] Reset security token
- [ ] Check email for token
- [ ] Copy token
- [ ] Enter all 3 credentials in BizIntel AI
- [ ] Click "Connect"
- [ ] See green "Connected" banner ✅

## After You Connect

1. Click "Seed Intelligence Data"
2. Go to Agent Console → Run agents
3. Continue with Agentforce setup

**What's your status? Can you access the email to get the token?**
