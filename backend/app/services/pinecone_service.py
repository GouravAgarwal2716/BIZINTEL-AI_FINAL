try:
    from pinecone import Pinecone, ServerlessSpec
    HAS_PINECONE = True
except ImportError:
    HAS_PINECONE = False
    print("⚠️ Pinecone library not found.")

from app.core.config import settings

# Global client
pc = None
INDEX_NAME = "bizintel-ai"

def get_pinecone_client():
    global pc
    if pc is None and HAS_PINECONE and settings.PINECONE_API_KEY:
        try:
            pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        except Exception as e:
            print(f"⚠️ Pinecone init failed: {e}")
            pc = None
    return pc

class PineconeService:
    @staticmethod
    def ensure_index():
        client = get_pinecone_client()
        if not client:
            return
        
        # Check existing indexes using new list_indexes() object
        if INDEX_NAME not in [i.name for i in client.list_indexes()]:
            try:
                client.create_index(
                    name=INDEX_NAME,
                    dimension=384,
                    metric='cosine',
                    spec=ServerlessSpec(cloud='aws', region='us-east-1')
                )
            except Exception as e:
                print(f"⚠️ Could not create index: {e}")

    @staticmethod
    def upsert_vectors(vectors, namespace: str):
        client = get_pinecone_client()
        if not client:
            print(f"⚠️ Mock Upsert ({len(vectors)} vectors) -> {namespace}")
            return

        try:
            index = client.Index(INDEX_NAME)
            index.upsert(vectors=vectors, namespace=namespace)
        except Exception as e:
            print(f"⚠️ Upsert failed: {e}")

    @staticmethod
    def query_vectors(query_embedding, namespace: str, top_k=5):
        client = get_pinecone_client()
        if not client:
            # Return dummy results if Pinecone is offline/mocked
            return {
                "matches": [
                    {"id": "MOCK_1", "score": 0.9, "metadata": {"text": "Mock result 1"}},
                    {"id": "MOCK_2", "score": 0.8, "metadata": {"text": "Mock result 2"}}
                ]
            }

        try:
            index = client.Index(INDEX_NAME)
            return index.query(
                vector=query_embedding,
                namespace=namespace,
                top_k=top_k,
                include_metadata=True
            )
        except Exception as e:
            print(f"⚠️ Query failed: {e}")
            return {"matches": []}
