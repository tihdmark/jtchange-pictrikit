#!/bin/bash
# Quick test script for Upstash Redis API

echo "🧪 Testing PictriKit Feedback API with Upstash Redis"
echo "=================================================="
echo ""

DOMAIN="${1:-https://www.pictrikit.com}"

echo "📍 Testing domain: $DOMAIN"
echo ""

# Test 1: Debug endpoint
echo "1️⃣ Testing /api/debug..."
curl -s "$DOMAIN/api/debug" | jq '.'
echo ""

# Test 2: GET feedback
echo "2️⃣ Testing GET /api/feedback..."
curl -s "$DOMAIN/api/feedback" | jq '.'
echo ""

# Test 3: POST feedback
echo "3️⃣ Testing POST /api/feedback..."
curl -s -X POST "$DOMAIN/api/feedback" \
  -H "Content-Type: application/json" \
  -d "{\"content\":\"Test from script at $(date)\",\"username\":\"TestUser$(date +%s)\"}" | jq '.'
echo ""

# Test 4: GET feedback again
echo "4️⃣ Testing GET /api/feedback again (should show new message)..."
curl -s "$DOMAIN/api/feedback" | jq '.feedback | length'
echo ""

echo "✅ Tests complete!"
echo ""
echo "Expected results:"
echo "  - Debug: redis.status = 'connected'"
echo "  - POST: stored = true"
echo "  - GET: feedback array with at least 1 item"
