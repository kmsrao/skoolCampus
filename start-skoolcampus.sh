#!/bin/bash

# SkoolCampus Startup Script for Mac/Linux
# This script starts both backend and frontend servers

echo "🎓 Starting SkoolCampus..."
echo "================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Checking dependencies...${NC}"

# Check if backend dependencies are installed
if [ ! -d "nestjs-backend/node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd nestjs-backend && npm install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "angular-frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd angular-frontend && npm install && cd ..
fi

# Check if .env exists
if [ ! -f "nestjs-backend/.env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from .env.example...${NC}"
    cp nestjs-backend/.env.example nestjs-backend/.env
    echo -e "${YELLOW}⚠️  Please edit nestjs-backend/.env with your database credentials!${NC}"
    echo -e "${YELLOW}Press Enter to continue after editing .env, or Ctrl+C to exit...${NC}"
    read
fi

# Generate Prisma Client if needed
if [ ! -d "nestjs-backend/node_modules/.prisma" ]; then
    echo -e "${BLUE}🔧 Generating Prisma Client...${NC}"
    cd nestjs-backend && npm run prisma:generate && cd ..
fi

echo ""
echo -e "${GREEN}✅ Starting Backend (NestJS)...${NC}"
echo -e "${BLUE}   Backend will run on: http://localhost:3000${NC}"
echo -e "${BLUE}   API Docs: http://localhost:3000/api/docs${NC}"
echo ""

# Start backend in background
cd nestjs-backend
npm run start:dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo -e "${GREEN}   Backend PID: $BACKEND_PID${NC}"
echo ""

# Wait a bit for backend to start
echo -e "${YELLOW}⏳ Waiting for backend to initialize (10 seconds)...${NC}"
sleep 10

echo -e "${GREEN}✅ Starting Frontend (Angular)...${NC}"
echo -e "${BLUE}   Frontend will run on: http://localhost:4200${NC}"
echo ""

# Start frontend in background
cd angular-frontend
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}   Frontend PID: $FRONTEND_PID${NC}"
echo ""

# Save PIDs to file for stopping later
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

echo "================================"
echo -e "${GREEN}🚀 SkoolCampus is starting up!${NC}"
echo ""
echo -e "${BLUE}📊 Services:${NC}"
echo -e "   Backend:  http://localhost:3000/api"
echo -e "   Frontend: http://localhost:4200"
echo -e "   API Docs: http://localhost:3000/api/docs"
echo ""
echo -e "${YELLOW}📝 Logs:${NC}"
echo -e "   Backend:  tail -f backend.log"
echo -e "   Frontend: tail -f frontend.log"
echo ""
echo -e "${YELLOW}⏹️  To stop:${NC}"
echo -e "   Run: ./stop-skoolcampus.sh"
echo -e "   Or:  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo -e "${GREEN}✨ Open http://localhost:4200 in your browser!${NC}"
echo "================================"

# Wait a bit more for frontend to fully start
echo ""
echo -e "${YELLOW}⏳ Waiting for frontend to build (30 seconds)...${NC}"
sleep 30

# Try to open browser
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:4200
elif command -v open &> /dev/null; then
    open http://localhost:4200
fi

echo ""
echo -e "${GREEN}✅ SkoolCampus is ready!${NC}"
echo -e "${BLUE}Press Ctrl+C to view logs, or run './stop-skoolcampus.sh' to stop all services${NC}"
echo ""

# Keep script running and show logs
tail -f backend.log frontend.log
