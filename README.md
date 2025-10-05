# DocuMind

A modern document intelligence system with RAG (Retrieval-Augmented Generation) capabilities, built using FastAPI, React, and Google's Generative AI.

## Features

### Document Processing
- Multi-format support (PDF, DOCX, XLSX, TXT)
- Intelligent text extraction with OCR capabilities
- Document chunking and vectorization
- Entity extraction and relationship mapping

### AI Capabilities
- RAG-powered document querying
- Google's PaLM integration for summarization
- Semantic search across documents
- Question-answering based on document content

### Modern Tech Stack
#### Backend
- FastAPI for high-performance API
- LangChain for RAG pipeline
- ChromaDB for vector storage
- PostgreSQL for metadata storage

#### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Real-time processing status
- Interactive document viewer

## Architecture

```
DocuMind/
├── frontend/                        # React frontend application
│   ├── src/
│   │   ├── api/                    # API integration
│   │   ├── components/             # Reusable UI components
│   │   ├── contexts/               # React contexts
│   │   ├── hooks/                  # Custom hooks
│   │   └── pages/                  # Application pages
│   ├── public/                     # Static assets
│   └── package.json                # Frontend dependencies
├── src/                            # Backend application
│   ├── pipeline/                   # Document processing pipeline
│   │   ├── document_processor.py   # Document handling
│   │   ├── ingest.py              # File ingestion
│   │   ├── langchain_rag.py       # RAG implementation
│   │   └── vectorstore.py         # Vector store management
│   ├── main.py                    # FastAPI application
│   ├── database.py                # Database configuration
│   ├── models.py                  # SQLAlchemy models
│   └── schemas.py                 # Pydantic schemas
├── data/                          # Data storage
│   ├── uploads/                   # Document storage
│   ├── chroma_db/                 # Vector database
│   └── logs/                      # Application logs
├── tests/                         # Test suites
│   ├── test_api.py               # API tests
│   └── test_pipeline.py          # Pipeline tests
├── migrations/                    # Database migrations
├── scripts/                       # Utility scripts
└── docker-compose.yml            # Container orchestration
```

## Prerequisites

### Development Environment
- Python 3.9+
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 15+

### API Keys and Services
- Google PaLM API key
- PostgreSQL database
- (Optional) Cloud storage configuration

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/DhanaAnjana/DocuMind.git
   cd DocuMind
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the application:
   ```bash
   docker-compose up --build
   ```

The application will be available at:
- Frontend: http://localhost:5173
- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Development Setup

### Backend Setup

1. Create Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run database migrations:
   ```bash
   alembic upgrade head
   ```

4. Start the development server:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

### Frontend Setup

1. Install Node.js dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Document Management
- `POST /api/v1/documents/`: Upload a document
- `GET /api/v1/documents/`: List all documents
- `GET /api/v1/documents/{id}`: Get document details
- `GET /api/v1/documents/{id}/status`: Check processing status

### Document Intelligence
- `POST /api/v1/query/`: Query documents using RAG
- `POST /api/v1/documents/{id}/summarize`: Generate document summary
- `GET /api/v1/documents/{id}/entities`: Extract document entities

## Testing

### Running Tests

1. Unit tests:
   ```bash
   pytest tests/ -v
   ```

2. With coverage report:
   ```bash
   pytest --cov=src tests/
   ```

### Test Categories
- API endpoint tests
- RAG pipeline tests
- Document processing tests
- Frontend component tests

## Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/documind
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=documind

# Google AI
GOOGLE_API_KEY=your-api-key
```

## Maintenance

### Backup

To backup the database and uploaded files:
```bash
chmod +x scripts/backup.sh
./scripts/backup.sh
```

### Database Migrations

Create a new migration:
```bash
alembic revision --autogenerate -m "description"
```

Apply migrations:
```bash
alembic upgrade head
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.