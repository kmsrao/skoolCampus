#!/bin/bash

echo "======================================"
echo "Testing SkoolCampus Admin Login"
echo "======================================"
echo ""

# Login and extract token
echo "1. Testing Login..."
LOGIN_RESPONSE=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@skoolcampus.com","password":"admin"}' \
  -s)

# Extract access token using grep and cut
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

echo "✅ Login successful!"
echo ""
echo "Login Response:"
echo "$LOGIN_RESPONSE" | python -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Test protected endpoint
echo "======================================"
echo "2. Testing Protected Endpoint (/api/auth/me)"
echo "======================================"
echo ""

ME_RESPONSE=$(curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -s)

echo "Response:"
echo "$ME_RESPONSE" | python -m json.tool 2>/dev/null || echo "$ME_RESPONSE"
echo ""

# Test dashboard endpoint
echo "======================================"
echo "3. Testing Dashboard Endpoint"
echo "======================================"
echo ""

DASHBOARD_RESPONSE=$(curl -X GET "http://localhost:3000/api/dashboard/admin?branchId=1" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -s)

echo "Response:"
echo "$DASHBOARD_RESPONSE" | python -m json.tool 2>/dev/null || echo "$DASHBOARD_RESPONSE"
echo ""

echo "======================================"
echo "✅ All Tests Complete!"
echo "======================================"
