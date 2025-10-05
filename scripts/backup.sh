#!/bin/bash

# Get current timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$TIMESTAMP"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup database
echo "Backing up database..."
docker-compose exec -T db pg_dump -U user documind > "$BACKUP_DIR/database.sql"

# Backup uploaded files
echo "Backing up uploaded files..."
cp -r data/uploads "$BACKUP_DIR/"

# Backup vector store
echo "Backing up vector store..."
cp -r data/chroma_db "$BACKUP_DIR/"

# Create archive
tar -czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"
rm -rf "$BACKUP_DIR"

echo "Backup completed: $BACKUP_DIR.tar.gz"