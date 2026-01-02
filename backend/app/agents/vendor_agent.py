from app.services.agent_engine import AgentBase
from typing import List, Dict

class VendorAgent(AgentBase):
    def observe(self) -> List[Dict]:
        """Simulate scanning Vendor Contracts"""
        # Demo: Just pick an account to attach "Contract Renewal" task to
        query = "SELECT Id, Name FROM Account LIMIT 1"
        accounts = self.sf.query_all(query)['records']
        return accounts

    def reason(self, observations: List[Dict]) -> List[Dict]:
        actions = []
        for acc in observations:
            actions.append({
                "type": "alert_legal",
                "account_id": acc['Id'],
                "account_name": acc['Name'],
                "reasoning": "Detected Software License expiring in 14 days."
            })
        return actions

    def act(self, actions: List[Dict]):
        results = []
        for action in actions:
            self.sf.Task.create({
                "Subject": f"⚠️ Contract Renewal: {action['account_name']}",
                "Description": "BizIntel Agent: License expiring. Legal review needed.",
                "Priority": "Normal",
                "Status": "Not Started",
                "WhatId": action['account_id']
            })
            results.append({"status": "success", "detail": "Alerted Legal Team"})
        return results
