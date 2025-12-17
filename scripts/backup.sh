#!/bin/bash

# Affiliate Monitor Backup Script

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="affiliate_monitor_backup_${TIMESTAMP}.sql"

echo "💾 Starting backup..."

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Backup PostgreSQL database
echo "📦 Backing up database..."
docker-compose exec -T postgres pg_dump -U ${DB_USER:-postgres} ${DB_NAME:-affiliate_monitor} > ${BACKUP_DIR}/${BACKUP_FILE}

# Compress backup
echo "🗜️  Compressing backup..."
gzip ${BACKUP_DIR}/${BACKUP_FILE}

echo "✅ Backup completed: ${BACKUP_DIR}/${BACKUP_FILE}.gz"

# Delete backups older than 30 days
echo "🧹 Cleaning old backups (older than 30 days)..."
find ${BACKUP_DIR} -name "*.sql.gz" -mtime +30 -delete

echo "✅ Backup process finished!"
