#!/bin/bash

# Affiliate Monitor Setup Script

set -e

echo "🚀 Starting Affiliate Monitor setup..."

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env file from .env.example..."
  cp .env.example .env
  echo "⚠️  Please edit .env file with your configuration before running the application!"
  echo "   You need to set: JWT_SECRET, TELEGRAM_BOT_TOKEN, and affiliate IDs"
  exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Please install Docker first."
  exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
  echo "❌ Docker Compose is not installed. Please install Docker Compose first."
  exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Build and start containers
echo "🏗️  Building Docker containers..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
  echo "✅ Services are running!"
  echo ""
  echo "📊 Access the application:"
  echo "   Frontend: http://localhost:3001"
  echo "   Backend API: http://localhost:3000/api/v1"
  echo ""
  echo "📝 View logs:"
  echo "   docker-compose logs -f"
  echo ""
  echo "🛑 Stop services:"
  echo "   docker-compose down"
else
  echo "❌ Failed to start services. Check logs with: docker-compose logs"
  exit 1
fi
