"""RAG implementation using direct Google Gemini SDK instead of langchain_google_genai."""
"""
A functional RAG implementation using the direct Google Gemini SDK.
This version focuses on correctness and simplicity.
"""
from typing import List, Dict, TypedDict, Optional
from os import getenv

import google.generativeai as genai
from sqlalchemy.orm import Session
from sqlalchemy import select, tuple_

# Assuming these local modules exist and are correctly defined
from .. import models
from .vectorstore import VectorStore # Using a synchronous VectorStore

# --- Initialize clients and configurations once ---
try:
    GOOGLE_API_KEY = getenv("GOOGLE_API_KEY") or getenv("GEMINI_API_KEY")
    if not GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY / GEMINI_API_KEY environment variable not set")
    genai.configure(api_key=GOOGLE_API_KEY)
except ValueError as e:
    print(f"Error during Gemini configuration: {e}")
    GOOGLE_API_KEY = None

# --- Use TypedDict for clear data structures ---
class Source(TypedDict):
    content: str
    document_id: Optional[int]
    chunk_id: Optional[int]
    score: float

class RAGResponse(TypedDict):
    answer: str
    sources: List[Source]

# Initialize a synchronous vector store
vector_store = VectorStore()

def query_documents(query: str, limit: int, db: Session) -> List[RAGResponse]:
    """
    Query documents using RAG + direct Gemini calls (Synchronous Version).
    """
    if not GOOGLE_API_KEY:
        return [{
            "answer": "The generative model is not configured. Please check the API key.",
            "sources": []
        }]

    # 1. Retrieve relevant chunks from the vector store
    relevant_chunks = vector_store.similarity_search(query, k=limit)
    if not relevant_chunks:
        return [{
            "answer": "No relevant information was found in the documents.",
            "sources": []
        }]

    # 2. Gather identifiers for a single database query
    chunk_identifiers = []
    for chunk in relevant_chunks:
        metadata = chunk.get("metadata", {})
        doc_id = metadata.get("document_id")
        emb_id = metadata.get("id") or metadata.get("embedding_id")
        if doc_id is not None and emb_id is not None:
            chunk_identifiers.append((doc_id, emb_id))

    chunk_id_map = {}
    if chunk_identifiers:
        # Fetch all chunks in one go to avoid N+1 queries
        stmt = select(models.DocumentChunk).where(
            tuple_(models.DocumentChunk.document_id, models.DocumentChunk.embedding_id).in_(
                chunk_identifiers
            )
        )
        db_chunks = db.execute(stmt).scalars().all()
        chunk_id_map = {(c.document_id, c.embedding_id): c.id for c in db_chunks}

    # 3. Build context for the prompt
    context = "\n\n".join(chunk["content"] for chunk in relevant_chunks)

    # 4. Build a robust prompt
    prompt = (
        "You are a helpful assistant. Use the following context to answer the question. "
        "If you cannot answer from the context, say “I don’t know.”\n\n"
        f"Context:\n{context}\n\nQuestion: {query}"
    )

    # 5. Call Gemini API with the correct model name
    try:
        # CORRECTED: Using the exact model name from your available list.
        model = genai.GenerativeModel("gemini-2.5-flash-preview-05-20")
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=0.1)
        )
        answer = response.text
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return [{
            "answer": f"An error occurred while communicating with the Gemini API: {e}",
            "sources": []
        }]

    # 6. Build the sources list
    sources: List[Source] = []
    for chunk in relevant_chunks:
        metadata = chunk.get("metadata", {})
        doc_id = metadata.get("document_id")
        emb_id = metadata.get("id") or metadata.get("embedding_id")
        
        chunk_id = chunk_id_map.get((doc_id, emb_id)) if doc_id is not None and emb_id is not None else None

        sources.append({
            "content": chunk["content"],
            "document_id": doc_id,
            "chunk_id": chunk_id,
            "score": 1.0 - chunk.get("distance", 1.0)
        })

    # Return the response
    return [{
        "answer": answer,
        "sources": sources
    }]