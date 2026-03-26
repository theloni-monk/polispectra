#!/bin/bash

# Polispectra API Test Script
# Tests all endpoints with sample data

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
API_BASE="${API_URL:-http://localhost:3001}"
PASS=0
FAIL=0

echo -e "${BLUE}🧪 Polispectra API Test Suite${NC}"
echo "=================================="
echo -e "Testing API at: ${API_BASE}"
echo ""

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5

    echo -n "Testing $description... "

    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$API_BASE$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi

    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ $status_code${NC}"
        ((PASS++))
    else
        echo -e "${RED}✗ Got $status_code, expected $expected_status${NC}"
        echo "Response: $body"
        ((FAIL++))
    fi
}

# Sample data
PHILOSOPHY_DATA='{
  "title": "Test Philosophy",
  "answers": [
    {
      "scaleA": "self_mind",
      "scaleB": "self_tissue",
      "preference": "A"
    },
    {
      "scaleA": "self_tissue",
      "scaleB": "self_body",
      "preference": "B"
    },
    {
      "scaleA": "rel_parents",
      "scaleB": "oth_neighborhood",
      "preference": "A"
    }
  ]
}'

echo -e "${BLUE}POST Endpoint Tests${NC}"
echo "---"
test_endpoint "POST" "/api/submit" "$PHILOSOPHY_DATA" "200" "Submit philosophy"
test_endpoint "POST" "/api/submit" '{"title":"incomplete"}' "400" "Reject incomplete philosophy"
test_endpoint "POST" "/api/submit" '{"title":"hi","answers":[]}' "400" "Reject empty answers"

echo ""
echo -e "${BLUE}GET Endpoint Tests${NC}"
echo "---"
test_endpoint "GET" "/api/philosophies" "" "200" "Fetch philosophies"
test_endpoint "GET" "/api/spectrum" "" "200" "Fetch spectrum data"

echo ""
echo -e "${BLUE}Error Handling Tests${NC}"
echo "---"
test_endpoint "DELETE" "/api/submit" "" "405" "Reject unsupported method"
test_endpoint "POST" "/api/invalid" "$PHILOSOPHY_DATA" "404 or 500" "Handle invalid endpoint"

echo ""
echo "=================================="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
