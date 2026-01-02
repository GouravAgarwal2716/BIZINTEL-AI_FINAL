# BizIntel AI - Autonomous Revenue Intelligence for Salesforce

> **AppExchange-Grade Platform** | Agentforce-Powered | Einstein Analytics Integration

## 🎯 Hackathon Solution

**Domain:** Business Automation  
**Problem Statements Addressed:**
1. ✅ Customer Onboarding & Relationship Management
2. ✅ Sales Lead & Opportunity Tracking
3. ✅ Vendor & Business Partner Management

## 🏗️ Architecture

### Hybrid Intelligence System
```
┌─────────────────────────────────────────────────────────┐
│                   BizIntel AI Platform                  │
│  (React + TypeScript + Material UI + Lightning Design)  │
└────────────────┬────────────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼────────┐      ┌────────▼─────────┐
│ Agentforce │      │  Backend Engine  │
│  (Salesforce)     │   (FastAPI)      │
│                   │                  │
│ • Onboarding      │ • RAG (Pinecone) │
│ • Sales Copilot   │ • Analytics      │
│ • Vendor Mgmt     │ • Monitoring     │
└───┬────────┘      └────────┬─────────┘
    │                        │
    └────────────┬───────────┘
                 │
        ┌────────▼─────────┐
        │   Salesforce     │
        │  (Data + Actions)│
        └──────────────────┘
```

## ✨ Key Features

### 1. Agentforce Integration (Salesforce Native)
- **3 Autonomous Agents** running in Salesforce
- **Real-time Activity Monitoring** via Event API
- **Conversational Interface** (embeddable chat widget)

### 2. Intelligence Layer (Our Platform)
- **RAG Engine**: Semantic search over Salesforce data (Pinecone + Sentence Transformers)
- **Churn Prediction**: ML-powered risk detection
- **Revenue Analytics**: Data Cloud visualization

### 3. Professional UI
- **Lightning Design System** inspired interface
- **Real-time Dashboards** with live agent activity
- **Einstein-style Analytics** with interactive charts

## 🚀 Quick Start

### Prerequisites
- Salesforce Developer Edition (with Agentforce enabled)
- Supabase Account
- Pinecone Account
- Node.js 18+
- Python 3.11+

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure .env
cp .env.example .env
# Add your Supabase, Pinecone, Salesforce credentials

# Run database setup in Supabase SQL Editor
# (see backend/database_setup.sql)

# Start server
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install

# Configure .env
cp .env.example .env
# Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Start dev server
npm run dev
```

### Salesforce Agentforce Setup
Follow the guide in `AGENTFORCE_SETUP_GUIDE.md` to create:
1. Customer Onboarding Assistant
2. Sales Lead Copilot
3. Vendor & Contract Manager

## 📊 Demo Flow

1. **Login** → Supabase Auth
2. **Connect Salesforce** → Encrypted credential storage
3. **Seed Demo Data** → Creates Accounts, Leads, Opportunities
4. **View Agentforce Dashboard** → See 3 active agents
5. **Run Agents** → Creates Tasks, Updates Records
6. **Intelligence Atlas** → View churn predictions & analytics
7. **Settings** → Manage connection & preferences

## 🎨 Technology Stack

### Frontend
- **React 18** + **TypeScript**
- **Material-UI** (Lightning Design inspired)
- **Recharts** (Analytics visualization)
- **Axios** (API client)

### Backend
- **FastAPI** (Python async framework)
- **Supabase** (Auth + Database)
- **Pinecone** (Vector database for RAG)
- **Sentence Transformers** (Embeddings)
- **Simple-Salesforce** (API integration)

### Salesforce
- **Agentforce** (Conversational AI agents)
- **Flows** (Automation actions)
- **Event Monitoring API** (Activity tracking)

## 🔐 Security

- **Encrypted Credentials**: Salesforce credentials encrypted with Fernet
- **JWT Authentication**: Supabase session tokens
- **Row-Level Security**: User-isolated data in Supabase
- **Namespace Isolation**: Per-user Pinecone namespaces

## 📈 Metrics & Monitoring

The platform tracks:
- **Agent Actions**: Real-time feed of Agentforce activities
- **Data Counts**: Leads, Opportunities, Cases, Tasks
- **Churn Risk**: AI-detected at-risk accounts
- **Revenue Performance**: Target vs Actual analytics

## 🏆 Why This Wins

1. **Meets All Requirements**: Uses actual Salesforce Agentforce ✅
2. **Goes Beyond**: Adds RAG + Predictive Analytics ✅
3. **Production-Ready**: Enterprise UI + Security ✅
4. **Complete Solution**: Solves all 3 problem statements ✅

## 📝 License

MIT License - Built for Salesforce Agentforce Hackathon 2026

## 👨‍💻 Author

Built with ❤️ using Salesforce Agentforce, FastAPI, and React
