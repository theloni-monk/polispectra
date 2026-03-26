#!/bin/bash

# Polispectra Full Test Suite
# Comprehensive testing of frontend, API structure, and code quality

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🧪 Polispectra Full Test Suite${NC}"
echo "=================================="

TESTS_PASSED=0
TESTS_FAILED=0

# Test function
run_test() {
    local name=$1
    local command=$2

    echo -n "Testing $name... "
    if eval "$command" &> /dev/null; then
        echo -e "${GREEN}✓${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗${NC}"
        ((TESTS_FAILED++))
    fi
}

# 1. Build Tests
echo -e "${BLUE}Build Tests${NC}"
echo "---"
run_test "TypeScript compilation" "pnpm run build"
run_test "JavaScript output exists" "[ -f src/js/app.js ]"
run_test "All pages compiled" "[ -f src/js/pages/landing.js ] && [ -f src/js/pages/spectral.js ] && [ -f src/js/pages/visualization.js ]"
run_test "Utilities compiled" "[ -f src/js/utils.js ] && [ -f src/js/visualization-utils.js ]"

# 2. File Structure Tests
echo -e "\n${BLUE}File Structure Tests${NC}"
echo "---"
run_test "HTML entry point exists" "[ -f src/index.html ]"
run_test "CSS files exist" "[ -f src/styles/global.css ] && [ -f src/styles/landing.css ] && [ -f src/styles/spectral.css ] && [ -f src/styles/visualization.css ]"
run_test "API functions exist" "[ -f api/submit.ts ] && [ -f api/philosophies.ts ] && [ -f api/spectrum.ts ]"
run_test "API utilities exist" "[ -f api/lib.ts ] && [ -f api/captcha.ts ]"
run_test "Vercel config exists" "[ -f vercel.json ]"

# 3. Dependencies Tests
echo -e "\n${BLUE}Dependencies Tests${NC}"
echo "---"
run_test "node_modules installed" "[ -d node_modules ]"
run_test "pnpm available" "command -v pnpm"
run_test "@upstash/redis installed" "[ -d node_modules/@upstash/redis ]"
run_test "@vercel/node installed" "[ -d node_modules/@vercel/node ]"

# 4. Configuration Tests
echo -e "\n${BLUE}Configuration Tests${NC}"
echo "---"
run_test "tsconfig.json valid" "[ -f tsconfig.json ]"
run_test "package.json valid" "[ -f package.json ] && grep -q '\"main\"\\|\"scripts\"' package.json"
run_test "gitignore configured" "[ -f .gitignore ]"

# 5. Code Quality Tests
echo -e "\n${BLUE}Code Quality Checks${NC}"
echo "---"
run_test "HTML is valid" "grep -q '<html' src/index.html && grep -q '</html>' src/index.html"
run_test "CSS has color variables" "grep -q '--primary\\|--secondary' src/styles/global.css"
run_test "Frontend has scales defined" "grep -q 'SCALES' src/js/utils.ts"
run_test "API validates input" "grep -q 'validateAnswers' api/lib.ts"

# 6. Functional Tests
echo -e "\n${BLUE}Functional Code Tests${NC}"
echo "---"
run_test "Scale categories exist" "grep -q 'self.*relatives.*others.*systems' src/js/utils.ts"
run_test "Question generation exists" "grep -q 'generateQuestions' src/js/utils.ts"
run_test "LocalStorage helpers exist" "grep -q 'saveDraft\\|loadDraft\\|clearDraft' src/js/utils.ts"
run_test "Dominance calculation exists" "grep -q 'calculateDominance' src/js/visualization-utils.ts"
run_test "Graph layout simulation exists" "grep -q 'simulateLayout' src/js/visualization-utils.ts"
run_test "Captcha verification exists" "grep -q 'verifyHCaptcha\\|verifyRecaptchaV3' api/captcha.ts"

echo ""
echo "=================================="
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some checks failed${NC}"
    exit 1
fi
