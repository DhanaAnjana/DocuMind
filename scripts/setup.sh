#!/bin/bash

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create necessary directories
mkdir -p data/uploads data/chroma_db data/logs

# Set up environment variables
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Please update .env with your configuration"
fi

# Initialize database
docker-compose up -d db
sleep 5  # Wait for database to be ready
alembic upgrade head

echo "Setup completed successfully!"
echo "Please update .env with your configuration and run 'docker-compose up' to start the application."