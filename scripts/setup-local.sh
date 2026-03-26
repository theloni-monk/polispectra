#!/bin/bash

# Polispectra Local Test Environment Setup
# This script sets up everything needed to run the app locally

set -e  # Exit on error

echo "🚀 Polispectra Local Test Environment Setup"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Please install pnpm:"
    echo "   npm install -g pnpm"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version)${NC}"
echo -e "${GREEN}✓ pnpm $(pnpm --version)${NC}"

# 2. Install dependencies
echo -e "\n${BLUE}Installing dependencies with pnpm...${NC}"
pnpm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# 3. Build TypeScript
echo -e "\n${BLUE}Building TypeScript...${NC}"
pnpm run build
echo -e "${GREEN}✓ TypeScript compiled${NC}"

# 4. Set up environment variables
echo -e "\n${BLUE}Setting up environment variables...${NC}"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    cat > .env.local << 'EOF'
# Redis Configuration (set to your Upstash Redis instance)
REDIS_URL=redis://localhost:6379
REDIS_TOKEN=your_token_here

# hCaptcha Configuration (optional for local testing)
HCAPTCHA_SECRET=your_hcaptcha_secret

# reCAPTCHA v3 Configuration (optional for local testing)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret

# Frontend API Base URL (for local development)
VITE_API_URL=http://localhost:3001
EOF
    echo -e "${GREEN}✓ Created .env.local (configure Redis/captcha keys as needed)${NC}"
else
    echo -e "${GREEN}✓ .env.local already exists${NC}"
fi

# 5. Display startup instructions
echo -e "\n${YELLOW}Setup Complete!${NC}"
echo "=========================================="
echo ""
echo -e "${BLUE}To start the development server:${NC}"
echo "  pnpm run serve"
echo ""
echo -e "${BLUE}In another terminal, to watch TypeScript changes:${NC}"
echo "  pnpm run dev"
echo ""
echo -e "${BLUE}The app will be available at:${NC}"
echo "  http://localhost:3000"
echo ""
echo -e "${BLUE}For API testing (requires local Redis):${NC}"
echo "  1. Update .env.local with your Redis credentials"
echo "  2. Deploy to Vercel or use local serverless emulator"
echo ""
echo -e "${YELLOW}Frontend Features:${NC}"
echo "  • Landing page with initial question"
echo "  • Spectral interface with slider comparisons"
echo "  • Visualization page with heatmap & rankings"
echo "  • LocalStorage draft persistence"
echo ""
echo -e "${YELLOW}Backend (Vercel Functions):${NC}"
echo "  • POST /api/submit - Submit philosophy"
echo "  • GET /api/philosophies - Fetch recent submissions"
echo "  • GET /api/spectrum - Get spectrum statistics"
echo ""
echo "=========================================="
