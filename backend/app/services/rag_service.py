from app.services.embedding import EmbeddingService
from app.services.pinecone_service import PineconeService
from app.routers.salesforce import check_data_status # Reuse logic to get SF client
from simple_salesforce import Salesforce

class RAGService:
    @staticmethod
    def chunk_text(text: str, chunk_size=500):
        # Naive splitter for now
        return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

    @staticmethod
    def ingest_salesforce_data(user_id: str, sf_client: Salesforce):
        """
        Fetches core objects and indexes them.
        """
        objects = ['Account', 'Opportunity', 'Task', 'Lead']
        vectors = []
        
        for obj in objects:
            # Fetch limited fields for context
            query = f"SELECT Id, Name FROM {obj} LIMIT 100"
            if obj == 'Task': 
                query = "SELECT Id, Subject, Description FROM Task LIMIT 100"
            if obj == 'Lead':
               query = "SELECT Id, Name, Company, Status FROM Lead LIMIT 100"

            try:
                data = sf_client.query_all(query)['records']
                
                for record in data:
                    # Construct Context String
                    text_content = ""
                    if obj == 'Account': text_content = f"Account: {record['Name']}"
                    elif obj == 'Opportunity': text_content = f"Opportunity: {record['Name']}"
                    elif obj == 'Task': text_content = f"Task: {record['Subject']} - {record['Description']}"
                    elif obj == 'Lead': text_content = f"Lead: {record['Name']} at {record['Company']}, Status: {record['Status']}"
                    
                    if text_content:
                        embedding = EmbeddingService.get_embedding(text_content)
                        # ID format: ObjType_ID
                        vectors.append((f"{obj}_{record['Id']}", embedding, {"text": text_content, "type": obj}))

            except Exception as e:
                print(f"Error fetching {obj}: {e}")
                continue

        # Upsert to Pinecone
        if vectors:
            PineconeService.upsert_vectors(vectors, namespace=f"user_{user_id}")
            return len(vectors)
        return 0

    @staticmethod
    def search_context(query: str, user_id: str):
        query_embedding = EmbeddingService.get_embedding(query)
        results = PineconeService.query_vectors(query_embedding, namespace=f"user_{user_id}")
        
        matches = []
        for match in results['matches']:
            matches.append(match['metadata']['text'])
        
        return matches
