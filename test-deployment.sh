#!/bin/bash
# Test script for Redis Labs deployment

echo "🧪 Testing PictriKit Feedback API with Redis Labs"
echo "=================================================="
echo ""

DOMAIN="${1:-https://www.pictrikit.com}"

echo "📍 Testing domain: $DOMAIN"
echo ""

# Test 1: Debug endpoint
echo "1️⃣ Testing /api/debug..."
echo "Expected: redis.status = 'connected'"
RESPONSE=$(curl -s "$DOMAIN/api/debug")
echo "$RESPONSE" | jq '.'
STATUS=$(echo "$RESPONSE" | jq -r '.redis.status')

if [ "$STATUS" = "connected" ]; then
  echo "✅ Redis connection successful!"
else
  echo "❌ Redis connection failed: $STATUS"
  exit 1
fi
echo ""

# Test 2: GET feedback (before POST)
echo "2️⃣ Testing GET /api/feedback (initial)..."
BEFORE_COUNT=$(curl -s "$DOMAIN/api/feedback" | jq '.feedback | length')
echo "Current feedback count: $BEFORE_COUNT"
echo ""

# Test 3: POST feedback
echo "3️⃣ Testing POST /api/feedback..."
POST_RESPONSE=$(curl -s -X POST "$DOMAIN/api/feedback" \
  -H "Content-Type: application/json" \
  -d "{\"content\":\"Test from script at $(date)\",\"username\":\"TestUser$(date +%s)\"}")
echo "$POST_RESPONSE" | jq '.'
STORED=$(echo "$POST_RESPONSE" | jq -r '.stored')

if [ "$STORED" = "true" ]; then
  echo "✅ Feedback stored successfully!"
else
  echo "❌ Feedback storage failed"
  exit 1
fi
echo ""

# Test 4: GET feedback (after POST)
echo "4️⃣ Testing GET /api/feedback (after POST)..."
sleep 1  # Wait a moment for Redis
AFTER_COUNT=$(curl -s "$DOMAIN/api/feedback" | jq '.feedback | length')
echo "New feedback count: $AFTER_COUNT"

if [ "$AFTER_COUNT" -gt "$BEFORE_COUNT" ]; then
  echo "✅ Feedback retrieved successfully!"
else
  echo "⚠️  Warning: Feedback count did not increase"
fi
echo ""

# Summary
echo "=================================================="
echo "✅ All tests completed!"
echo ""
echo "Summary:"
echo "  - Redis connection: $STATUS"
echo "  - Feedback stored: $STORED"
echo "  - Feedback count: $BEFORE_COUNT → $AFTER_COUNT"
echo ""
echo "Next steps:"
echo "  1. Visit $DOMAIN/feedback.html"
echo "  2. Submit a test message"
echo "  3. Refresh and verify it appears"
