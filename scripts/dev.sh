#!/bin/bash

# Polispectra Development Server
# Runs both the TypeScript watcher and the local server

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Polispectra Development Environment${NC}"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Dependencies not installed. Run setup-local.sh first.${NC}"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    pkill -P $$ || true
}

trap cleanup EXIT INT TERM

# Start TypeScript watcher in background
echo -e "${BLUE}Starting TypeScript watcher...${NC}"
npm run dev &
DEV_PID=$!
echo -e "${GREEN}✓ TypeScript watcher running (PID: $DEV_PID)${NC}"

# Give TypeScript a moment to compile
sleep 2

# Start the dev server
echo -e "${BLUE}Starting local server on port 3000...${NC}"
npm run serve &
SERVER_PID=$!
echo -e "${GREEN}✓ Server running at http://localhost:3000${NC}"

echo ""
echo -e "${YELLOW}Development environment ready!${NC}"
echo "  - TypeScript files auto-compile on save"
echo "  - Refresh browser to see changes"
echo "  - Press Ctrl+C to stop"
echo ""

# Wait for both processes
wait
