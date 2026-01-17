#!/bin/bash

# Script to start both backend and frontend in development mode

echo "🚀 Starting Mini Time Tracker development servers..."

# Ensure we're using Node.js v22
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"

# Check Node version
NODE_VERSION=$(node --version)
echo "Using Node.js $NODE_VERSION"

if [[ ! "$NODE_VERSION" =~ ^v2[0-9]\. ]]; then
    echo "⚠️  Warning: Node.js v20+ is required. Current version: $NODE_VERSION"
    echo "Please run: export PATH=\"/opt/homebrew/opt/node@22/bin:\$PATH\""
    exit 1
fi

# Start backend in background
echo "📦 Starting backend on http://localhost:3001..."
cd backend
npm run start:dev > /tmp/backend-dev.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend on http://localhost:3000..."
cd frontend
npm run dev > /tmp/frontend-dev.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Servers started successfully!"
echo ""
echo "📍 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "📋 Process IDs:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "📊 View logs:"
echo "   Backend:  tail -f /tmp/backend-dev.log"
echo "   Frontend: tail -f /tmp/frontend-dev.log"
echo ""
echo "🛑 To stop servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
