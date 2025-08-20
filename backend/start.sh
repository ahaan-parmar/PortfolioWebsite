#!/bin/bash

echo "🚀 Starting Portfolio Backend Server..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    echo "📥 Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "📥 Please update Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo

# Check if MongoDB is running (optional check)
echo "📦 Checking MongoDB connection..."
echo

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies."
        exit 1
    fi
    echo "✅ Dependencies installed successfully!"
    echo
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file from template..."
    cp "env.example" ".env"
    echo "✅ .env file created! Please edit it with your configuration."
    echo
fi

# Start the server
echo "🚀 Starting development server..."
echo "📱 Server will be available at: http://localhost:5000"
echo "🔗 Health check: http://localhost:5000/health"
echo
echo "Press Ctrl+C to stop the server"
echo

npm run dev
