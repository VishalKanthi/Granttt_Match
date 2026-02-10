"""
TF-IDF based semantic matching engine (lightweight alternative to sentence-transformers)
"""
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List, Tuple


class EmbeddingsService:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=5000,
            ngram_range=(1, 2)
        )
        self._fitted = False
        self._corpus = []
        self._embeddings = None
    
    def fit(self, texts: List[str]):
        """Fit the vectorizer on corpus of grant texts"""
        self._corpus = texts
        self._embeddings = self.vectorizer.fit_transform(texts)
        self._fitted = True
    
    def encode(self, text: str) -> np.ndarray:
        """Encode a single text into a vector"""
        if not self._fitted:
            # If not fitted, fit on the input text only
            return self.vectorizer.fit_transform([text]).toarray()[0]
        return self.vectorizer.transform([text]).toarray()[0]
    
    def calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate semantic similarity between two texts"""
        combined = [text1, text2]
        tfidf_matrix = self.vectorizer.fit_transform(combined)
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(similarity)
    
    def find_similar(self, query: str, top_k: int = 25) -> List[Tuple[int, float]]:
        """Find most similar items in corpus to query"""
        if not self._fitted:
            return []
        
        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self._embeddings)[0]
        
        # Get top-k indices
        top_indices = np.argsort(similarities)[::-1][:top_k]
        return [(int(idx), float(similarities[idx])) for idx in top_indices]


# Global instance
embeddings_service = EmbeddingsService()
