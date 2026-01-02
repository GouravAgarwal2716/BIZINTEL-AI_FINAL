from duckduckgo_search import DDGS
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class WebSearchService:
    def __init__(self):
        self.ddgs = DDGS()

    def search_market_intel(self, query: str, max_results: int = 5) -> Dict:
        """
        Performs a real-time web search to gather market intelligence.
        """
        try:
            logger.info(f"🔍 Searching Web for: {query}")
            
            # 1. Market News Search
            results = list(self.ddgs.text(f"{query} market news business financial", max_results=max_results))
            
            # 2. Sentiment/Summary Construction (Simple version for speed)
            summary_points = []
            for r in results:
                summary_points.append(f"- [{r['title']}]({r['href']}): {r['body']}")
            
            return {
                "status": "success",
                "query": query,
                "summary": "\n".join(summary_points),
                "raw_results": results
            }
            
        except Exception as e:
            logger.error(f"❌ Web Search Failed: {str(e)}")
            return {
                "status": "error",
                "message": str(e)
            }
