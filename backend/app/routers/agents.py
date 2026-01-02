from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
from supabase import create_client, Client
from app.core.config import settings
from app.services.encryption import decrypt_value
from simple_salesforce import Salesforce

# Import Agents
from app.agents.onboarding_agent import OnboardingAgent
from app.agents.sales_agent import SalesAgent
from app.agents.retention_agent import RetentionAgent
from app.agents.vendor_agent import VendorAgent
from app.agents.market_scout_agent import MarketScoutAgent

router = APIRouter()
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

@router.post("/run/{agent_name}")
async def run_agent(agent_name: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    user_email = current_user.get('email')
    
    # 1. Connect SF
    
    response = supabase.table("user_settings").select("*").eq("user_id", user_id).execute()
    if not response.data or not response.data[0].get('is_connected'):
         raise HTTPException(status_code=400, detail="Salesforce not connected")
    settings_row = response.data[0]
    creds = {
        'username': decrypt_value(settings_row['sf_username']),
        'password': decrypt_value(settings_row['sf_password']),
        'security_token': decrypt_value(settings_row['sf_security_token']),
        'domain': settings_row.get('sf_domain', 'login')
    }
    try:
        sf = Salesforce(username=creds['username'], password=creds['password'], security_token=creds['security_token'], domain=creds['domain'])
    except Exception:
        raise HTTPException(status_code=400, detail="Salesforce Connection Failed")

    # 2. Select Agent
    try:
        agent = None
        if agent_name == "onboarding":
            agent = OnboardingAgent(sf, user_id, user_email)
        elif agent_name == "sales":
            agent = SalesAgent(sf, user_id, user_email)
        elif agent_name == "retention":
            agent = RetentionAgent(sf, user_id, user_email)
        elif agent_name == "vendor":
            agent = VendorAgent(sf, user_id, user_email)
        elif agent_name == "executive":
            agent = ExecutiveAgent(sf, user_id, user_email)
        elif agent_name == "market_scout":
            agent = MarketScoutAgent(sf, user_id, user_email)
        else:
            raise HTTPException(status_code=404, detail="Agent not found")

        # 3. Run
        report = agent.run()
        return {"logs": report["logs"]}
        
    except Exception as e:
        import traceback
        traceback.print_exc() # Print to server terminal
        raise HTTPException(status_code=500, detail=f"Agent Runtime Error: {str(e)}")
