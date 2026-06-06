#!/bin/bash

# PlusOne Television - Hostinger Deployment Script
# Usage: bash deploy.sh

set -e  # Exit on error

echo "🚀 PlusOne Television Deployment Script"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="sidhareporting.com"
APP_DIR="/home/$(whoami)/plusone-television"
REPO_URL="https://github.com/yourusername/plusone-television.git"

echo -e "${BLUE}📋 Deployment Checklist:${NC}"
echo "1. Code pulled from GitHub"
echo "2. .env file in backend/ directory"
echo "3. Docker and Docker Compose installed"
echo "4. Nginx configured"
echo "5. SSL certificate installed"
echo ""

# Step 1: Pull latest code
echo -e "${YELLOW}Step 1: Pulling latest code...${NC}"
cd "$APP_DIR"
git pull origin main
echo -e "${GREEN}✓ Code pulled successfully${NC}"
echo ""

# Step 2: Check .env file
echo -e "${YELLOW}Step 2: Checking environment files...${NC}"
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}✗ backend/.env not found!${NC}"
    echo "Please copy your .env file to backend/.env"
    exit 1
fi
echo -e "${GREEN}✓ backend/.env found${NC}"
echo ""

# Step 3: Stop running containers
echo -e "${YELLOW}Step 3: Stopping existing containers...${NC}"
docker-compose down
echo -e "${GREEN}✓ Containers stopped${NC}"
echo ""

# Step 4: Build Docker images
echo -e "${YELLOW}Step 4: Building Docker images...${NC}"
docker-compose build
echo -e "${GREEN}✓ Docker images built${NC}"
echo ""

# Step 5: Start containers
echo -e "${YELLOW}Step 5: Starting containers...${NC}"
docker-compose up -d
echo -e "${GREEN}✓ Containers started${NC}"
echo ""

# Step 6: Check container status
echo -e "${YELLOW}Step 6: Checking container status...${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}"
echo ""

# Step 7: Display logs
echo -e "${BLUE}📊 Recent Logs:${NC}"
echo ""
echo -e "${BLUE}Backend logs:${NC}"
docker logs express-server --tail 5
echo ""
echo -e "${BLUE}Frontend logs:${NC}"
docker logs react-client --tail 5
echo ""

# Final status
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "🌐 Your application is available at:"
echo "   Frontend: https://$DOMAIN"
echo "   API: https://$DOMAIN/apis/v1/"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Restart: docker-compose restart"
echo "   Stop: docker-compose down"
echo "   Pull updates: git pull origin main && docker-compose up -d --build"
