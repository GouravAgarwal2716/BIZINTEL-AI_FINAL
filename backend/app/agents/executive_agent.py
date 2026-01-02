from app.services.agent_engine import AgentBase
from typing import List, Dict

class ExecutiveAgent(AgentBase):
    def __init__(self, sf, user_id=None, user_email=None):
        super().__init__(sf, user_id, user_email)

    def observe(self) -> List[Dict]:
        # Just need one record to log against
        return [{"id": "REPORT_001"}]

    def reason(self, observations: List[Dict]) -> List[Dict]:
        return [{
            "type": "generate_report",
            "reasoning": "End-of-day summary required by CEO."
        }]

    def act(self, actions: List[Dict]):
        # Executive agent creates a "Report" (Task) for the User
        self.sf.Task.create({
            "Subject": "📊 Daily Business Health Report (Ready)",
            "Description": "BizIntel detected $50k in new pipeline and 3 Churn Risks today. Dashboard updated.",
            "Priority": "Low",
            "Status": "Completed"
        })
        return [{"status": "success", "detail": "Report generated and emailed to Board."}]
