#!/bin/bash

# Affiliate Monitor Deployment Script

set -e

echo "🚀 Starting deployment..."

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Pull latest changes (if using git)
if [ -d .git ]; then
  echo "📥 Pulling latest changes..."
  git pull origin main
fi

# Stop running containers
echo "🛑 Stopping running containers..."
docker-compose down

# Build new images
echo "🏗️  Building new Docker images..."
docker-compose build --no-cache

# Start services
echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check health
echo "🏥 Checking service health..."
if curl -f http://localhost:3000/api/v1/health > /dev/null 2>&1; then
  echo "✅ Backend is healthy"
else
  echo "❌ Backend health check failed"
  docker-compose logs backend
  exit 1
fi

if curl -f http://localhost:3001 > /dev/null 2>&1; then
  echo "✅ Frontend is healthy"
else
  echo "❌ Frontend health check failed"
  docker-compose logs frontend
  exit 1
fi

echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Services:"
echo "   Frontend: http://localhost:3001"
echo "   Backend: http://localhost:3000"
echo ""
echo "📝 View logs: docker-compose logs -f"
