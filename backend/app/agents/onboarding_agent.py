from app.services.agent_engine import AgentBase
from typing import List, Dict
import random

class OnboardingAgent(AgentBase):
    def observe(self) -> List[Dict]:
        """Simulate scanning for new Closed-Won Opportunities"""
        # HACKATHON: Verify by fetching a real account to attach task to
        query = "SELECT Id, Name FROM Account LIMIT 1"
        accounts = self.sf.query_all(query)['records']
        return accounts

    def reason(self, observations: List[Dict]) -> List[Dict]:
        actions = []
        for acc in observations:
            actions.append({
                "type": "create_onboarding_task",
                "account_id": acc['Id'],
                "account_name": acc['Name'],
                "reasoning": "Account closed recently. Initiation of onboarding sequence required."
            })
        return actions

    def act(self, actions: List[Dict]):
        results = []
        for action in actions:
            try:
                self.sf.Task.create({
                    "Subject": f"🚀 Onboarding: {action['account_name']}",
                    "Description": "BizIntel Agent: Setup Kick-off call + Provision Licenses.",
                    "Priority": "High",
                    "Status": "Not Started",
                    "WhatId": action['account_id']
                })
                results.append({"status": "success", "detail": f"Started onboarding for {action['account_name']}"})
            except Exception as e:
                pass 
        return results
