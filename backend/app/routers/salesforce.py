from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.dependencies import get_current_user
from app.services.salesforce_connector import SalesforceService
from app.core.supabase import supabase
from app.services.encryption import decrypt_value
from simple_salesforce import Salesforce

router = APIRouter()

class SalesforceConnectRequest(BaseModel):
    username: str
    password: str
    security_token: str
    domain: str = 'login'

@router.post("/connect")
async def connect_salesforce(
    creds: SalesforceConnectRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user['id']
    
    # 1. Validate Connection
    try:
        org_metadata = SalesforceService.validate_and_connect(creds.dict())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 2. Encrypt Credentials
    encrypted_creds = SalesforceService.encrypt_credentials(creds.dict())

    # 3. Store in Supabase 'user_settings' table
    # Schema expected: user_id (PK), sf_username, sf_password, sf_security_token, sf_domain, is_connected, org_metadata (jsonb)
    data = {
        "user_id": user_id,
        **encrypted_creds,
        "is_connected": True,
        "org_metadata": org_metadata
    }

    try:
        # Upsert
        supabase.table("user_settings").upsert(data).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

    return {"status": "success", "org": org_metadata}

@router.get("/status")
async def get_connection_status(current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    response = supabase.table("user_settings").select("is_connected, org_metadata").eq("user_id", user_id).execute()
    
    if response.data and len(response.data) > 0:
        return response.data[0]
    
    return {"is_connected": False, "org_metadata": None}

@router.post("/disconnect")
async def disconnect_salesforce(current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    
    # We can either delete the row or just clear fields. Secure approach: clear credentials.
    data = {
        "user_id": user_id,
        "sf_username": None,
        "sf_password": None,
        "sf_security_token": None,
        "is_connected": False,
        "org_metadata": None
    }
    
    supabase.table("user_settings").upsert(data).execute()
    return {"status": "disconnected"}

@router.get("/data-status")
async def check_data_status(current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    
    # 1. Get Credentials
    response = supabase.table("user_settings").select("*").eq("user_id", user_id).execute()
    if not response.data or not response.data[0].get('is_connected'):
         raise HTTPException(status_code=400, detail="Salesforce not connected")
    
    settings_row = response.data[0]
    
    # 2. Decrypt & Connect
    creds = {
        'username': decrypt_value(settings_row['sf_username']),
        'password': decrypt_value(settings_row['sf_password']),
        'security_token': decrypt_value(settings_row['sf_security_token']),
        'domain': settings_row.get('sf_domain', 'login')
    }
    
    try:
        sf = Salesforce(
            username=creds['username'],
            password=creds['password'],
            security_token=creds['security_token'],
            domain=creds['domain']
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail="Could not connect to Salesforce to check data")

    # 3. Check Data
    from app.services.data_bootstrap import DataBootstrapService
    return DataBootstrapService.check_data_presence(sf)

@router.post("/seed")
async def seed_data(current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    
    # 1. Get Credentials
    response = supabase.table("user_settings").select("*").eq("user_id", user_id).execute()
    if not response.data or not response.data[0].get('is_connected'):
         raise HTTPException(status_code=400, detail="Salesforce not connected")
    
    settings_row = response.data[0]
    
    # 2. Decrypt & Connect
    creds = {
        'username': decrypt_value(settings_row['sf_username']),
        'password': decrypt_value(settings_row['sf_password']),
        'security_token': decrypt_value(settings_row['sf_security_token']),
        'domain': settings_row.get('sf_domain', 'login')
    }
    
    try:
        sf = Salesforce(
            username=creds['username'],
            password=creds['password'],
            security_token=creds['security_token'],
            domain=creds['domain']
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail="Could not connect to Salesforce")

    # 3. Seed Data
    from app.services.data_bootstrap import DataBootstrapService
    return DataBootstrapService.seed_demo_data(sf)
