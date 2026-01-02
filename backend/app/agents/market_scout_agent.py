from app.services.agent_engine import AgentBase
from app.services.email_service import send_email
from typing import List, Dict
import random

class MarketScoutAgent(AgentBase):
    def observe(self) -> List[Dict]:
        """
        Scans leads to find 'Market Intel' candidates.
        """
        # HACKATHON LOGIC: Always pick 2 random leads to "Find News" for.
        # This guarantees the demo is exciting every time.
        query = "SELECT Id, Name, Email, Company, Status FROM Lead WHERE Status != 'Closed - Converted' LIMIT 10"
        leads = self.sf.query_all(query)['records']
        if not leads:
            return []
            
        targets = random.sample(leads, min(len(leads), 2))
        return targets

    def reason(self, observations: List[Dict]) -> List[Dict]:
        actions = []
        news_headlines = [
            "Announces Series B Funding round of $50M",
            "Rumored to be acquiring a smaller competitor",
            "CEO announces strategic shift to AI",
            "Quarterly earnings beat expectations by 20%"
        ]

        for lead in observations:
            # Simulate "Web Search" finding a hit
            found_news = random.choice(news_headlines)
            
            actions.append({
                "type": "market_intel_action",
                "lead_id": lead['Id'],
                "lead_name": lead['Name'],
                "company": lead['Company'],
                "email": lead.get('Email'),
                "news": found_news,
                "reasoning": f"Detected high-signal market event: '{found_news}'. Immediate action required."
            })
        return actions

    def act(self, actions: List[Dict]):
        results = []
        for action in actions:
            try:
                # 1. Create a "Hot" Task
                self.sf.Task.create({
                    "Subject": f"⚡ Market Intel: {action['company']} - {action['news']}",
                    "Description": f"BizIntel Scout detected news: {action['news']}. \nReasoning: {action['reasoning']}",
                    "Priority": "High",
                    "Status": "Not Started",
                    "WhoId": action['lead_id']
                })

                # 2. Touch the Lead (Update Description)
                self.sf.Lead.update(action['lead_id'], {
                   "Description": f"[{action['news']}] - Flagged by Market Scout"
                })

                # 3. Send "Real" Alert Email
                email_body = f"""
                🚨 BizIntel Market Alert 🚨
                
                Company: {action['company']}
                News: {action['news']}
                
                Action Taken: Task created in Salesforce.
                Recommendation: Call {action['lead_name']} immediately to leverage this news.
                
                - BizIntel AI
                """
                # Send to the logged-in user
                recipient = self.user_email if self.user_email else "demo_user@bizzintel.com"
                send_email(recipient, f"Market Alert: {action['company']}", email_body)

                results.append({
                    "company": action['company'], 
                    "news": action['news'],
                    "status": "success"
                })

            except Exception as e:
                results.append({"status": "error", "error": str(e)})

        return results
