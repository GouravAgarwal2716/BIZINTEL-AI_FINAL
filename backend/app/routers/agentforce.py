from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
from app.core.supabase import supabase
from app.services.encryption import decrypt_value
from simple_salesforce import Salesforce
from datetime import datetime, timedelta
from typing import List, Dict

router = APIRouter()

@router.get("/activity")
async def get_agentforce_activity(current_user: dict = Depends(get_current_user)):
    """
    Simulates Agentforce activity by querying recent Tasks created by our agents.
    In production, this would use Salesforce Event Monitoring API.
    """
    user_id = current_user['id']
    
    # Get Salesforce credentials
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
        sf = Salesforce(
            username=creds['username'],
            password=creds['password'],
            security_token=creds['security_token'],
            domain=creds['domain']
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail="Could not connect to Salesforce")
    
    # Query recent Tasks (created by our agents)
    seven_days_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%dT%H:%M:%SZ')
    query = f"""
        SELECT Id, Subject, Description, Status, CreatedDate, WhatId, What.Name
        FROM Task 
        WHERE CreatedDate >= {seven_days_ago}
        AND (Subject LIKE '%AI%' OR Subject LIKE '%Agent%')
        ORDER BY CreatedDate DESC
        LIMIT 20
    """
    
    try:
        tasks = sf.query_all(query)['records']
        
        # Transform into activity feed format
        activities = []
        for task in tasks:
            agent_type = "Unknown"
            if "Onboarding" in task['Subject']:
                agent_type = "Onboarding Assistant"
            elif "Follow" in task['Subject'] or "Lead" in task['Subject']:
                agent_type = "Sales Copilot"
            elif "Renewal" in task['Subject'] or "Contract" in task['Subject']:
                agent_type = "Vendor Manager"
            elif "Churn" in task['Subject']:
                agent_type = "Retention Agent"
            
            activities.append({
                "id": task['Id'],
                "agent": agent_type,
                "action": task['Subject'],
                "description": task.get('Description', ''),
                "target": task['What']['Name'] if task.get('What') else 'N/A',
                "timestamp": task['CreatedDate'],
                "status": task['Status']
            })
        
        return {
            "total_actions": len(activities),
            "activities": activities,
            "agents_active": len(set(a['agent'] for a in activities))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch activity: {str(e)}")

@router.get("/status")
async def get_agentforce_status(current_user: dict = Depends(get_current_user)):
    """
    Returns status of Agentforce agents (simulated based on our backend agents)
    """
    return {
        "agents": [
            {
                "name": "Customer Onboarding Assistant",
                "status": "active",
                "type": "service",
                "topics": ["New Customer Registration", "Onboarding Status", "Welcome Email"],
                "actions_today": 5
            },
            {
                "name": "Sales Lead Copilot",
                "status": "active",
                "type": "sales",
                "topics": ["Pending Leads", "Convert Lead", "Schedule Follow-up"],
                "actions_today": 12
            },
            {
                "name": "Vendor & Contract Manager",
                "status": "active",
                "type": "service",
                "topics": ["Upcoming Renewals", "Vendor Status", "Contract Alerts"],
                "actions_today": 3
            }
        ],
        "total_agents": 3,
        "total_actions_today": 20
    }
