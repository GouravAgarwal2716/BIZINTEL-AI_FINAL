from sentence_transformers import SentenceTransformer

class EmbeddingService:
    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            # Load local model (downloads on first run)
            cls._model = SentenceTransformer('all-MiniLM-L6-v2')
        return cls._model

    @staticmethod
    def get_embedding(text: str):
        model = EmbeddingService.get_model()
        # Returns np.array, convert to list for JSON/Pinecone
        return model.encode(text).tolist()
