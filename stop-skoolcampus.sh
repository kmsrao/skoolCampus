#!/bin/bash

# SkoolCampus Stop Script for Mac/Linux
# This script stops both backend and frontend servers

echo "🛑 Stopping SkoolCampus..."
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PID files exist
if [ -f ".backend.pid" ] && [ -f ".frontend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    FRONTEND_PID=$(cat .frontend.pid)

    echo -e "${YELLOW}Stopping Backend (PID: $BACKEND_PID)...${NC}"
    kill $BACKEND_PID 2>/dev/null || echo -e "${RED}Backend process not found${NC}"

    echo -e "${YELLOW}Stopping Frontend (PID: $FRONTEND_PID)...${NC}"
    kill $FRONTEND_PID 2>/dev/null || echo -e "${RED}Frontend process not found${NC}"

    # Clean up PID files
    rm -f .backend.pid .frontend.pid

    echo -e "${GREEN}✅ PID files cleaned up${NC}"
else
    echo -e "${YELLOW}No PID files found. Attempting to kill by port...${NC}"

    # Try to kill by port
    echo -e "${YELLOW}Killing process on port 3000 (Backend)...${NC}"
    lsof -ti:3000 | xargs kill -9 2>/dev/null || echo -e "${RED}No process on port 3000${NC}"

    echo -e "${YELLOW}Killing process on port 4200 (Frontend)...${NC}"
    lsof -ti:4200 | xargs kill -9 2>/dev/null || echo -e "${RED}No process on port 4200${NC}"
fi

# Also kill any node processes running our apps
echo -e "${YELLOW}Cleaning up any remaining processes...${NC}"
pkill -f "nest start" 2>/dev/null
pkill -f "ng serve" 2>/dev/null

# Clean up log files
if [ -f "backend.log" ] || [ -f "frontend.log" ]; then
    echo -e "${YELLOW}Cleaning up log files...${NC}"
    rm -f backend.log frontend.log
fi

echo "================================"
echo -e "${GREEN}✅ SkoolCampus stopped successfully!${NC}"
echo "================================"
