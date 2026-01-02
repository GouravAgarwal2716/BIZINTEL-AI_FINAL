import pinecone
from app.core.config import settings

# Initialize Pinecone (v2)
pinecone.init(
    api_key=settings.PINECONE_API_KEY,
    environment=settings.PINECONE_ENV
)

INDEX_NAME = "bizintel-ai"

class PineconeService:
    
    @staticmethod
    def ensure_index():
        """
        Creates index if not exists.
        """
        if INDEX_NAME not in pinecone.list_indexes():
            pinecone.create_index(
                name=INDEX_NAME,
                dimension=384, # all-MiniLM-L6-v2 dimension
                metric='cosine'
            )

    @staticmethod
    def upsert_vectors(vectors, namespace: str):
        """
        vectors: list of (id, query_vector, metadata)
        """
        PineconeService.ensure_index()
        index = pinecone.Index(INDEX_NAME)
        # Upsert in batches of 100 if needed, but for now direct
        index.upsert(vectors=vectors, namespace=namespace)

    @staticmethod
    def query_vectors(query_embedding, namespace: str, top_k=5):
        PineconeService.ensure_index()
        index = pinecone.Index(INDEX_NAME)
        return index.query(
            vector=query_embedding,
            namespace=namespace,
            top_k=top_k,
            include_metadata=True
        )
