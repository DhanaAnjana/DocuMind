"""Document ingestion pipeline."""
import os
import shutil
from fastapi import UploadFile
from sqlalchemy.orm import Session
from datetime import datetime

from .. import models
from .document_processor import extract_text, split_text
from .vectorstore import VectorStore

async def process_document(file: UploadFile, db: Session) -> models.Document:
    """Process and store a new document."""
    # Create uploads directory if it doesn't exist
    upload_dir = os.path.join("data", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save file
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Create document record with QUEUED status
    db_document = models.Document(
        filename=file.filename,
        content_type=file.content_type,
        file_path=file_path,
        status=models.DocumentStatus.QUEUED
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)

    try:
        # Update status to PROCESSING
        db_document.status = models.DocumentStatus.PROCESSING
        db.commit()
        
        # Extract and split text
        text = extract_text(file_path, file.content_type)
        chunks = split_text(text)

        # Initialize vector store
        vector_store = VectorStore()

        # Add chunks to vector store and database
        chunk_metadatas = [{"document_id": db_document.id} for _ in chunks]
        embedding_ids = vector_store.add_texts(chunks, chunk_metadatas)

        # Store chunks in database
        for i, (chunk, embedding_id) in enumerate(zip(chunks, embedding_ids)):
            db_chunk = models.DocumentChunk(
                document_id=db_document.id,
                content=chunk,
                embedding_id=embedding_id,
                chunk_index=i
            )
            db.add(db_chunk)

        # Update status to PROCESSED
        db_document.status = models.DocumentStatus.PROCESSED
        db.commit()
        
    except Exception as e:
        # Update status to ERROR
        db_document.status = models.DocumentStatus.ERROR
        db.commit()
        raise e

    return db_document