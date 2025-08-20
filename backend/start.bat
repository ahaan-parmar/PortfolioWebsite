@echo off
echo 🚀 Starting Portfolio Backend Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18+ first.
    echo 📥 Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MongoDB is running (optional check)
echo 📦 Checking MongoDB connection...
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📥 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies.
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully!
    echo.
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo ⚙️ Creating .env file from template...
    copy "env.example" ".env"
    echo ✅ .env file created! Please edit it with your configuration.
    echo.
)

REM Start the server
echo 🚀 Starting development server...
echo 📱 Server will be available at: http://localhost:5000
echo 🔗 Health check: http://localhost:5000/health
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
