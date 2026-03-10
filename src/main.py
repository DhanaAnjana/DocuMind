"""Main FastAPI application."""
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

from . import models, schemas
from .database import get_db, engine
from .pipeline.ingest import process_document
from .pipeline.langchain_rag import query_documents
from .auth import router as auth_router

# Verify required environment variables
if not os.getenv("GOOGLE_API_KEY"):
    raise ValueError("GOOGLE_API_KEY environment variable is not set in .env file")

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="DocIntel API", version="1.0.0")

# Configure CORS - Update with your frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175", "http://localhost:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth router
app.include_router(auth_router, prefix="/api")

@app.get("/")
def read_root():
    """Health check endpoint."""
    return {"status": "ok", "message": "DocIntel API is running"}

@app.post("/api/documents/upload", response_model=schemas.Document)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload and process a new document."""
    try:
        # Validate file type
        allowed_types = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file.content_type}"
            )
        
        # Validate file size (10MB limit)
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Reset to beginning
        
        if file_size > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(
                status_code=400,
                detail="File size exceeds 10MB limit"
            )
        
        document = await process_document(file, db)
        return document
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents", response_model=list[schemas.Document])
def list_documents(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    db: Session = Depends(get_db)
):
    """List all documents with optional status filter."""
    query = db.query(models.Document)
    
    if status and status != "all":
        # Map frontend status to backend status
        query = query.filter(models.Document.status == status)
    
    documents = query.order_by(models.Document.created_at.desc()).offset(skip).limit(limit).all()
    return documents

@app.get("/api/documents/{document_id}", response_model=schemas.Document)
def get_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific document by ID."""
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@app.get("/api/documents/{document_id}/download")
def download_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """Download a document file."""
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    file_path = Path(document.file_path)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on server")
    
    return FileResponse(
        path=str(file_path),
        filename=document.filename,
        media_type=document.content_type
    )

@app.delete("/api/documents/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """Delete a document and its associated data."""
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    try:
        # Delete file from filesystem
        file_path = Path(document.file_path)
        if file_path.exists():
            file_path.unlink()
        
        # Delete chunks from database
        db.query(models.DocumentChunk).filter(
            models.DocumentChunk.document_id == document_id
        ).delete()
        
        # Delete document from database
        db.delete(document)
        db.commit()
        
        return {"message": "Document deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/query", response_model=list[dict])
async def query(
    query: schemas.Query,
    db: Session = Depends(get_db)
):
    """Query documents using RAG."""
    try:
        results = query_documents(query.query, query.limit, db)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    """Get document statistics."""
    total = db.query(models.Document).count()
    processed = db.query(models.Document).filter(models.Document.status == "processed").count()
    processing = db.query(models.Document).filter(
        models.Document.status.in_(["processing", "queued"])
    ).count()
    errors = db.query(models.Document).filter(models.Document.status == "error").count()
    
    return {
        "total": total,
        "processed": processed,
        "processing": processing,
        "errors": errors
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)