"""Vector store operations using Chroma."""
import os
from typing import List, Dict
import chromadb
from chromadb.config import Settings

class VectorStore:
    """Vector store wrapper for ChromaDB."""

    def __init__(self):
        """Initialize vector store."""
        persist_dir = os.path.join(os.getcwd(), "data", "chroma_db")
        self.client = chromadb.PersistentClient(
            path=persist_dir
        )
        self.collection = self.client.get_or_create_collection("documents")

    def add_texts(
        self,
        texts: List[str],
        metadata: List[Dict] = None,
        ids: List[str] = None
    ) -> List[str]:
        """Add texts to vector store."""
        if not metadata:
            metadata = [{}] * len(texts)
        if not ids:
            ids = [f"doc_{i}" for i in range(len(texts))]
            
        self.collection.add(
            documents=texts,
            metadatas=metadata,
            ids=ids
        )
        return ids

    def similarity_search(
        self,
        query: str,
        k: int = 5
    ) -> List[Dict]:
        """Search for similar texts."""
        results = self.collection.query(
            query_texts=[query],
            n_results=k
        )
        
        documents = []
        for i in range(len(results['documents'][0])):
            documents.append({
                'content': results['documents'][0][i],
                'metadata': results['metadatas'][0][i],
                'id': results['ids'][0][i],
                'distance': results['distances'][0][i]
            })
            
        return documents