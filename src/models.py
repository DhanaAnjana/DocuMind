"""SQLAlchemy models."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
import enum
from .database import Base

class DocumentStatus(str, enum.Enum):
    """Document processing status."""
    QUEUED = "queued"
    PROCESSING = "processing"
    PROCESSED = "processed"
    ERROR = "error"

class Document(Base):
    """Document model for storing document metadata."""
    
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), index=True)
    content_type = Column(String(100))
    file_path = Column(String(512))
    status = Column(Enum(DocumentStatus), default=DocumentStatus.QUEUED)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    """Document chunk model for storing processed document chunks."""
    
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"))
    content = Column(Text)
    embedding_id = Column(String(255))  # Reference to vector store
    chunk_index = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    document = relationship("Document", back_populates="chunks")


class User(Base):
    """User model for storing user information."""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    name = Column(String)
    picture = Column(String)
    provider = Column(String, default="google")
