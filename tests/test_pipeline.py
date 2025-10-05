import pytest
from pathlib import Path
import os
from src.pipeline import ingest, document_processor, langchain_rag, vectorstore

@pytest.fixture
def sample_pdf():
    # Create a temporary PDF file for testing
    pdf_path = Path("tests/data/sample.pdf")
    return pdf_path

@pytest.fixture
def vector_store():
    # Initialize a test vector store
    store = vectorstore.get_vector_store()
    yield store
    # Cleanup after tests
    store.clear()

def test_document_ingestion(sample_pdf):
    # Test document ingestion
    with open(sample_pdf, 'rb') as f:
        content = f.read()
    result = ingest.ingest_document("sample.pdf", content)
    
    assert isinstance(result, dict)
    assert "text" in result
    assert "metadata" in result
    assert result["metadata"]["page_count"] > 0

def test_document_processing():
    # Test document processing
    test_text = """
    Apple Inc. is headquartered in Cupertino, California. 
    Tim Cook is the CEO of Apple. The company was founded by Steve Jobs.
    """
    
    entities = document_processor.extract_entities(test_text)
    assert len(entities) > 0
    assert any(e["text"] == "Apple Inc." for e in entities)
    assert any(e["text"] == "Tim Cook" for e in entities)

def test_rag_pipeline(vector_store):
    # Test RAG pipeline
    test_documents = [
        "The capital of France is Paris.",
        "Berlin is the capital of Germany.",
        "Tokyo is the capital of Japan."
    ]
    
    # Index test documents
    for doc in test_documents:
        langchain_rag.add_to_vectorstore(doc, vector_store)
    
    # Test retrieval
    query = "What is the capital of France?"
    results = langchain_rag.query_documents(query, vector_store)
    
    assert results
    assert "Paris" in results[0]  # The response should mention Paris

def test_vector_search(vector_store):
    # Test vector search functionality
    test_doc = "Machine learning is a subset of artificial intelligence."
    langchain_rag.add_to_vectorstore(test_doc, vector_store)
    
    # Search for similar documents
    results = vector_store.similarity_search("What is ML?", k=1)
    assert len(results) == 1
    assert "machine learning" in results[0].page_content.lower()