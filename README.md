# Mini Time Tracker

A simple web application for tracking work hours across different projects.

## Features

The application provides:
- **Time Entry Form**: Clean form for logging work hours
- **Entry History**: Organized view of all entries grouped by date
- **Statistics**: Daily and grand totals for tracked hours
- **Validation**: Enforces 24-hour daily limit
- **Toast Notifications**: Real-time feedback for all actions

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: NestJS v11, REST API
- **Database**: SQLite with Prisma ORM
- **Validation**: class-validator (Backend) and React state (Frontend)

## Prerequisites

- **Node.js**: v22.x or higher (LTS recommended).
- **npm**: v10 or higher.
- **Docker** (optional): For containerized deployment.

## Getting Started

### Option 1: Using Docker (Recommended)

The easiest way to run the application is using Docker:

```bash
# Clone the repository
git clone <repository-url>
cd mini-time-tracker

# Start all services with Docker Compose
docker-compose up -d

# The application will be available at:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:3001
```

### Option 2: Manual Setup

#### Prerequisites Check
Before starting, ensure you have Node.js v22 or higher:
```bash
node --version  # Should show v22.x or higher
```

If you have an older version on macOS, install Node.js v22:
```bash
# Using Homebrew
brew install node@22

# Add to your PATH (add to ~/.zshrc for permanent use)
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
```

#### Quick Start (Recommended)
Use the provided scripts to start both servers:
```bash
./start-dev.sh   # Start both servers
./stop-dev.sh    # Stop both servers
```

#### Manual Setup

**1. Clone the repository**
```bash
git clone <repository-url>
cd mini-time-tracker
```

**2. Setup Backend**
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run start:dev
```
The backend will run on `http://localhost:3001`.

**3. Setup Frontend** (in a new terminal)
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```
The frontend will run on `http://localhost:3000`.

## Architecture

### Backend
- **NestJS**: Modular architecture with `EntriesModule` handling the business logic.
- **Prisma**: Used for type-safe database access and migrations with optimized indexes.
- **Validation**:
  - Global `ValidationPipe` with whitelist and transformation enabled.
  - `CreateEntryDto` ensures all fields are present and valid.
  - `EntriesService` implements the 24-hour limit per calendar date.
- **Error Handling**: Global exception filter for consistent error responses.
- **CORS**: Configured with explicit origin, credentials, and allowed methods.

### Frontend
- **Next.js App Router**: Modern routing with server/client component separation.
- **Tailwind CSS v4**: Utility-first CSS framework for rapid UI development.
- **TypeScript**: Full type safety across the application.
- **API Proxy**: Next.js rewrites to proxy API calls and avoid CORS issues.
- **UI Components**: Reusable Card, Button, Input, and Toast components.
- **Responsive Design**: Mobile-first approach with clean, modern interface.

### Database
- **SQLite**: Lightweight database with Prisma ORM.
- **Indexes**: Optimized indexes on `date`, `project`, and composite `(date, project)` for improved query performance.

## Features

### Core Functionality
- ✅ **Add Time Entries**: Log work hours with date, project, hours, and description
- ✅ **Entry Management**: Delete entries with confirmation
- ✅ **Smart Validation**: Enforce maximum 24 hours per day with real-time feedback
- ✅ **History View**: Browse entries grouped by date with daily and grand totals
- ✅ **Project Tracking**: Organize work across multiple projects

### User Experience
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 🌓 **Dark Mode**: Automatic light/dark theme based on system preferences
- 📱 **Responsive**: Optimized for desktop, tablet, and mobile devices
- ⚡ **Real-time Feedback**: Toast notifications for all actions
- 🎯 **Intuitive Layout**: Clean, organized interface with visual hierarchy
- ✨ **Smooth Animations**: Fade-in, slide-up, and scale effects

### Technical Features
- 🔒 **Type-Safe**: Full TypeScript implementation
- 🚀 **Performance**: Optimized database queries with indexes
- 🐳 **Docker Ready**: Easy deployment with Docker Compose
- 🔄 **CRUD Operations**: Complete Create, Read, Update, Delete support
- 📊 **Statistics**: Track total hours across all entries
- 🔄 **CI/CD**: Automated testing and build verification with GitHub Actions

## Docker Support

The project includes full Docker support for easy deployment:

### Docker Architecture
- **Backend Container**: NestJS application with SQLite database
- **Frontend Container**: Next.js application with production build
- **Docker Compose**: Orchestrates both services with proper networking

### Key Features
- Multi-stage builds for optimized image sizes
- Health checks for both services
- Persistent volume for SQLite database
- Automatic service restart on failure
- Environment-based configuration

### Docker Files
- `backend/Dockerfile` - Backend container configuration
- `frontend/Dockerfile` - Frontend container configuration
- `docker-compose.yml` - Service orchestration

## CI Pipeline

The project includes a GitHub Actions workflow that automatically:
- **Builds** both frontend and backend to ensure no compilation errors
- **Lints** the code to maintain quality standards
- **Verifies Docker Builds** for both services to ensure container compatibility
- **Caches Dependencies** to speed up workflow execution

The pipeline runs on every push to the `main` branch and on all pull requests.

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests (if available)
cd frontend
npm test
```

### Database Migrations
```bash
cd backend
# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy
```

### Code Quality
```bash
# Lint backend code
cd backend
npm run lint

# Lint frontend code
cd frontend
npm run lint

# Format code with Prettier
cd backend
npm run format
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL="file:./dev.db"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Note**: The frontend uses Next.js API rewrites (proxy) to avoid CORS issues. All API calls go through `/api/*` which is automatically proxied to `http://localhost:3001/*`.

## Docker Deployment

Build and run with Docker Compose:
```bash
docker-compose up --build
```

Stop services:
```bash
docker-compose down
```

View logs:
```bash
docker-compose logs -f
```

## Project Structure
```
mini-time-tracker/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── entries/
│   │   ├── filters/
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```