#!/bin/bash

echo "========================================="
echo "Student Tracker - Test Suite Runner"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend Tests
echo -e "${YELLOW}[1/2] Running Backend Tests...${NC}"
cd backend
mvn clean test
BACKEND_RESULT=$?

if [ $BACKEND_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ Backend tests passed${NC}"
else
    echo -e "${RED}✗ Backend tests failed${NC}"
fi

cd ..

# Frontend Tests
echo ""
echo -e "${YELLOW}[2/2] Running Frontend Tests...${NC}"
cd frontend/student-tracker
npm test -- --coverage --watchAll=false
FRONTEND_RESULT=$?

if [ $FRONTEND_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend tests passed${NC}"
else
    echo -e "${RED}✗ Frontend tests failed${NC}"
fi

cd ../..

# Summary
echo ""
echo "========================================="
echo "Test Summary"
echo "========================================="

if [ $BACKEND_RESULT -eq 0 ] && [ $FRONTEND_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
