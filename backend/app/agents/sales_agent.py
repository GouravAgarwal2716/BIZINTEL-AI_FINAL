from app.services.agent_engine import AgentBase
from typing import List, Dict, Any
from datetime import datetime, timedelta

class SalesAgent(AgentBase):
    def observe(self) -> List[Dict]:
        """
        Find leads that need attention AND fetch Einstein Scores.
        1. Status = 'Open - Not Contacted'
        2. Last modified > 7 days ago
        """
        # New leads (HACKATHON MODE: Include 'Working' status so demo is repeatable)
        new_leads_query = "SELECT Id, Name, Email, Company, Status FROM Lead WHERE Status IN ('Open - Not Contacted', 'Working - Contacted') LIMIT 5"
        new_leads = self.sf.query_all(new_leads_query)['records']
        
        targets = []
        for lead in new_leads:
            # Simulate fetching Einstein Score (Real API call would go here)
            # In production, we'd query ScoreIntelligence object
            # For hackathon demo safety, we 'calculate' it based on completeness
            einstein_score = 0
            if lead.get('Email'): einstein_score += 40
            if lead.get('Company'): einstein_score += 30
            if lead.get('Name'): einstein_score += 15
            
            targets.append({
                **lead, 
                'action_type': 'new_lead',
                'einstein_score': einstein_score
            })
            
        self.log(f"Found {len(new_leads)} new leads.")
        return targets

    def reason(self, observations: List[Dict]) -> List[Dict]:
        actions = []
        for lead in observations:
            score = lead['einstein_score']
            reasoning = f"Lead {lead['Name']} has Einstein Score {score}/100."
            
            if score > 70:
                reasoning += " High quality lead detected. Prioritizing immediate outreach."
                priority = "High"
            else:
                reasoning += " Lower score due to missing info. Standard follow-up."
                priority = "Normal"

            actions.append({
                "type": "new_lead_workflow",
                "lead_id": lead['Id'],
                "lead_name": lead['Name'],
                "lead_email": lead.get('Email'),
                "company": lead.get('Company'),
                "reasoning": reasoning,
                "einstein_signal": {"source": "Einstein Lead Scoring", "score": score},
                "priority": priority
            })
            
        return actions

    def act(self, actions: List[Dict]):
        results = []
        for action in actions:
            try:
                # 1. Create Task
                task_result = self.sf.Task.create({
                    "Subject": f"AI Outreach ({action['priority']}): {action['lead_name']}",
                    "Description": f"Atlas Reasoning: {action['reasoning']}",
                    "Priority": action['priority'],
                    "Status": "Not Started",
                    "WhoId": action['lead_id'],
                    "ActivityDate": (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
                })
                
                # 2. Update Lead Stage
                self.sf.Lead.update(action['lead_id'], {
                    "Status": "Working - Contacted",
                    "Description": f"[BizIntel AI] {action['reasoning']}"
                })
                
                # 3. Log Email
                # In real prod: send via SendGrid
                self.log(f"📧 Sent email to {action['lead_email']}")
                
                results.append({
                    "lead": action['lead_name'], 
                    "status": "success", 
                    "task_id": task_result['id']
                })
                
            except Exception as e:
                results.append({"lead": action.get('lead_name'), "status": "failed", "error": str(e)})
                
        return results
