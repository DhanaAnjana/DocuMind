# DocuMind

A document processing and RAG (Retrieval-Augmented Generation) pipeline application built with FastAPI, LangChain, and ChromaDB.

## Features

- Document upload and processing (PDF, DOCX, XLSX, TXT)
- Text extraction and chunking
- Vector storage using ChromaDB
- RAG-powered document querying
- REST API with FastAPI
- Docker containerization
- Database migrations with Alembic

## Prerequisites

- Python 3.9+
- Docker and Docker Compose
- PostgreSQL
- OpenAI API key

## Directory Structure

```
DocuMind/
├── src/                             # Main application
│   ├── pipeline/                    # RAG pipeline
│   ├── main.py                     # FastAPI application
│   ├── database.py                 # Database setup
│   ├── models.py                   # SQLAlchemy models
│   └── schemas.py                  # Pydantic schemas
├── data/                           # Data storage
│   ├── uploads/                    # Uploaded files
│   ├── chroma_db/                  # Vector database
│   └── logs/                       # Application logs
├── tests/                          # Test files
└── scripts/                        # Utility scripts
```

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/documind.git
   cd documind
   ```

2. Run the setup script:
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. Update the `.env` file with your configuration:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/documind
   OPENAI_API_KEY=your-api-key-here
   ```

4. Start the application:
   ```bash
   docker-compose up
   ```

The API will be available at http://localhost:8000

## API Endpoints

- `POST /documents/`: Upload a document
- `GET /documents/`: List all documents
- `POST /query/`: Query documents using RAG

## Development

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run migrations:
   ```bash
   alembic upgrade head
   ```

4. Start the development server:
   ```bash
   uvicorn src.main:app --reload
   ```

## Testing

Run tests using pytest:
```bash
pytest
```

## Backup

To backup the database and uploaded files:
```bash
chmod +x scripts/backup.sh
./scripts/backup.sh
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.