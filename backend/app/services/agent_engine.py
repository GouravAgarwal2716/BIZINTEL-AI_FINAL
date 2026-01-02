from simple_salesforce import Salesforce
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime
import json

class AgentBase(ABC):
    def __init__(self, sf: Salesforce, user_id: str = None, user_email: str = None):
        self.sf = sf
        self.user_id = user_id
        self.user_email = user_email
        self.agent_id = self.__class__.__name__

    @abstractmethod
    def observe(self) -> List[Dict]:
        """Gather data from Salesforce"""
        pass

    @abstractmethod
    def reason(self, observations: List[Dict]) -> List[Dict]:
        """Analyze data and decide on actions"""
        pass

    @abstractmethod
    def act(self, actions: List[Dict]):
        """Execute actions in Salesforce"""
        pass

    def run(self) -> Dict[str, Any]:
        """
        Main execution pipeline with Atlas-style transparency logging.
        Returns a structured execution report.
        """
        start_time = datetime.now()
        logs = []
        
        # 1. OBSERVE
        try:
            observations = self.observe()
            logs.append({
                "stage": "OBSERVE",
                "timestamp": datetime.now().isoformat(),
                "message": f"Scanned Salesforce environment. Found {len(observations)} relevant signals.",
                "data_citations": [f"Record ID: {obs.get('Id', 'N/A')}" for obs in observations[:5]] # Cite first 5
            })
        except Exception as e:
            return self._build_error_report(e, "OBSERVE")

        # 2. REASON
        try:
            actions = self.reason(observations)
            logs.append({
                "stage": "REASON",
                "timestamp": datetime.now().isoformat(),
                "message": f"Analyzed signals. Determined {len(actions)} necessary actions.",
                "reasoning_trace": [action.get('reasoning', 'Standard automated rule application') for action in actions],
                "confidence_score": 0.95 if actions else 1.0,
                "ai_signals_used": [action.get('einstein_signal') for action in actions if action.get('einstein_signal')]
            })
        except Exception as e:
            return self._build_error_report(e, "REASON")

        # 3. ACT
        try:
            execution_results = self.act(actions)
            logs.append({
                "stage": "ACT",
                "timestamp": datetime.now().isoformat(),
                "message": "Executed actions in Salesforce via API.",
                "details": execution_results
            })
        except Exception as e:
            return self._build_error_report(e, "ACT")

        # 4. REPORT
        duration = (datetime.now() - start_time).total_seconds()
        return {
            "status": "success",
            "agent_id": self.agent_id,
            "duration": duration,
            "logs": logs,
            "actions_count": len(actions) if 'actions' in locals() else 0
        }

    def log(self, message: str, details: Optional[Dict] = None):
        """Standard log helper - retained for backward compatibility"""
        print(f"[{self.agent_id}] {message}")
        if details:
            print(f"Details: {details}")

    def _build_error_report(self, error: Exception, stage: str) -> Dict[str, Any]:
        return {
            "status": "error",
            "agent_id": self.agent_id,
            "error_stage": stage,
            "error_message": str(error),
            "logs": [{
                "stage": stage,
                "timestamp": datetime.now().isoformat(),
                "message": f"Critical failure in {stage} phase: {str(error)}",
                "severity": "CRITICAL"
            }]
        }
