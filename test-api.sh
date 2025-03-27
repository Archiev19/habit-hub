#!/bin/bash

PORT=5000
API_URL="http://localhost:${PORT}/api"
TOKEN=""

echo "=== HabitHub API Test ==="
echo

# Function to check if server is running
check_server() {
  if ! curl -s "http://localhost:${PORT}/api/health" > /dev/null; then
    echo "Error: Server not running on port ${PORT}"
    echo "Start the server with: cd server && npm run test-mode"
    exit 1
  fi
}

# Check if server is running
echo "Checking if server is running..."
check_server
echo "Server is running on port ${PORT}"
echo

# Test health endpoint
echo "Testing health endpoint..."
curl -s "${API_URL}/health" | jq
echo

# Test user registration
echo "Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}')

echo $REGISTER_RESPONSE | jq
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')
echo "Token: $TOKEN"
echo

# Test authentication (get current user)
echo "Testing authentication (get current user)..."
curl -s "${API_URL}/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq
echo

# Test creating a habit
echo "Testing creating a habit..."
HABIT_RESPONSE=$(curl -s -X POST "${API_URL}/habits" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Habit","description":"This is a test habit","frequency":"daily"}')

echo $HABIT_RESPONSE | jq
HABIT_ID=$(echo $HABIT_RESPONSE | jq -r '._id')
echo "Habit ID: $HABIT_ID"
echo

# Test getting all habits
echo "Testing getting all habits..."
curl -s "${API_URL}/habits" \
  -H "Authorization: Bearer $TOKEN" | jq
echo

# Test toggling habit completion
echo "Testing toggling habit completion..."
curl -s -X POST "${API_URL}/habits/${HABIT_ID}/toggle" \
  -H "Authorization: Bearer $TOKEN" | jq
echo

# Test getting all habits after toggle
echo "Testing getting all habits after toggle..."
curl -s "${API_URL}/habits" \
  -H "Authorization: Bearer $TOKEN" | jq
echo

echo "=== Test Complete ===" 