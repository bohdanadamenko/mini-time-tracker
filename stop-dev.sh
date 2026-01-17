#!/bin/bash

# Script to stop development servers

echo "🛑 Stopping Mini Time Tracker development servers..."

# Kill all nest and next processes
pkill -f "nest start" && echo "✓ Backend stopped"
pkill -f "next dev" && echo "✓ Frontend stopped"

echo ""
echo "✅ All servers stopped!"
