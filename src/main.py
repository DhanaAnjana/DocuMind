"""Main FastAPI application."""
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from . import models, schemas
from .database import get_db, engine
from .pipeline.ingest import process_document
from .pipeline.langchain_rag import query_documents

# Verify required environment variables
if not os.getenv("GOOGLE_API_KEY"):
    raise ValueError("GOOGLE_API_KEY environment variable is not set in .env file")

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="DocuMind API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/documents/", response_model=schemas.Document)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload and process a new document."""
    try:
        document = await process_document(file, db)
        return document
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/documents/", response_model=list[schemas.Document])
def list_documents(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """List all documents."""
    documents = db.query(models.Document).offset(skip).limit(limit).all()
    return documents

@app.post("/query/", response_model=list[dict])
async def query(
    query: schemas.Query,
    db: Session = Depends(get_db)
):
    """Query documents using RAG."""
    try:
        results = query_documents(query.query, query.limit, db)
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)