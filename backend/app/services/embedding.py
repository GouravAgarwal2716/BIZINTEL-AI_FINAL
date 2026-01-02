try:
    from sentence_transformers import SentenceTransformer
    HAS_SENTENCE_TRANSFORMERS = True
except ImportError:
    HAS_SENTENCE_TRANSFORMERS = False
    print("⚠️ 'sentence-transformers' not found. Using Mock Embeddings.")

import numpy as np

class MockModel:
    def encode(self, text: str):
        # Return a 384-dimensional random vector (standard for MiniLM)
        return np.random.rand(384)

class EmbeddingService:
    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            if HAS_SENTENCE_TRANSFORMERS:
                cls._model = SentenceTransformer('all-MiniLM-L6-v2')
            else:
                cls._model = MockModel()
        return cls._model

    @staticmethod
    def get_embedding(text: str):
        model = EmbeddingService.get_model()
        result = model.encode(text)
        # Convert to list if it's a numpy array
        if hasattr(result, 'tolist'):
            return result.tolist()
        return result

