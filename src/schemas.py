"""Pydantic schemas for request/response models."""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class DocumentBase(BaseModel):
    """Base document schema."""
    filename: str
    content_type: str

class DocumentCreate(DocumentBase):
    """Schema for document creation."""
    pass

class DocumentChunkBase(BaseModel):
    """Base document chunk schema."""
    content: str
    chunk_index: int
    embedding_id: Optional[str] = None

class DocumentChunkCreate(DocumentChunkBase):
    """Schema for document chunk creation."""
    document_id: int

class DocumentChunk(DocumentChunkBase):
    """Schema for document chunk response."""
    id: int
    document_id: int
    created_at: datetime

    class Config:
        """Pydantic config."""
        from_attributes = True

class Document(DocumentBase):
    """Schema for document response."""
    id: int
    file_path: str
    created_at: datetime
    updated_at: datetime
    chunks: List[DocumentChunk] = []

    class Config:
        """Pydantic config."""
        from_attributes = True

class Query(BaseModel):
    """Schema for query request."""
    query: str = Field(..., description="The query text to search for")
    limit: int = Field(default=5, description="Number of results to return")