from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
from app.services.rag_service import RAGService
from app.services.salesforce_connector import SalesforceService
from supabase import create_client, Client
from app.core.config import settings
from app.services.encryption import decrypt_value
from simple_salesforce import Salesforce
from pydantic import BaseModel

router = APIRouter()
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

class QueryRequest(BaseModel):
    query: str

@router.post("/ingest")
async def ingest_data(current_user: dict = Depends(get_current_user)):
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

    # 3. Ingest
    try:
        count = RAGService.ingest_salesforce_data(user_id, sf)
        return {"status": "success", "indexed_count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion Failed: {str(e)}")

@router.post("/query")
async def query_context(request: QueryRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    try:
        results = RAGService.search_context(request.query, user_id)
        return {"context": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
