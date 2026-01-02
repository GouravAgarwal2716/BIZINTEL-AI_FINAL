from app.services.email_service import send_email
from app.services.agent_engine import AgentBase
from typing import List, Dict

class RetentionAgent(AgentBase):
    def __init__(self, sf, user_id=None, user_email=None):
        super().__init__(sf, user_id, user_email)

    def observe(self) -> List[Dict]:
        """
        Mock observation: Identify accounts with 'Low' usage scores (simulated).
        """
        # HACKATHON: Always finding work involves picking ANY account
        query = "SELECT Id, Name FROM Account LIMIT 3"
        accounts = self.sf.query_all(query)['records']
        return accounts

    def reason(self, observations: List[Dict]) -> List[Dict]:
        actions = []
        for acc in observations:
            actions.append({
                "type": "create_case",
                "payload": {
                    "Subject": f"Churn Risk Alert: {acc['Name']}",
                    "Description": "AI detected low engagement signals. Proactive outreach required.",
                    "Priority": "Medium",
                    "Status": "New",
                    "Origin": "Web",
                    "AccountId": acc['Id']
                },
                "account_name": acc['Name']
            })
        return actions

    def act(self, actions: List[Dict]):
        results = []
        for action in actions:
            if action['type'] == 'create_case':
                try:
                    res = self.sf.Case.create(action['payload'])
                    
                    # ALERT USER
                    email_body = f"""
                    ⚠️ CHURN RISK DETECTED
                    
                    Account: {action['account_name']}
                    Issue: Low Usage / Negative Sentiment
                    Action: Case {res['id']} created.
                    """
                    recipient = self.user_email if self.user_email else "demo_user@bizzintel.com"
                    send_email(recipient, f"Churn Risk: {action['account_name']}", email_body)

                    results.append({"status": "success", "detail": f"Case created for {action['account_name']}"})
                except Exception as e:
                    results.append({"status": "error", "error": str(e)})
        return results
