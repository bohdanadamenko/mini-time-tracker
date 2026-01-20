# Mini Time Tracker

A full-stack web application for tracking work hours across different projects with filtering, pagination, and a modern UI.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Radix UI, Lucide Icons
- **Backend**: NestJS v11, REST API
- **Database**: SQLite with Prisma ORM
- **DevOps**: Docker, Docker Compose, GitHub Actions CI/CD

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
- **Time Entry Management**: Create, edit, and delete time entries
- **Project Tracking**: Organize work across predefined projects (Viso Internal, Client A, Client B, Personal Development)
- **Smart Validation**: Enforce maximum 24 hours per calendar day
- **Filtering**: Filter entries by project and date range
- **Pagination**: Browse entries with configurable page size
- **History View**: Entries grouped by date with daily and grand totals

### User Experience
- **Dark Mode**: Light/dark theme toggle with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Toast Notifications**: Real-time feedback for all actions
- **Calendar Picker**: Premium date selection UI
- **Smooth Animations**: Fade-in, slide-up, and scale effects
- **Custom Dialogs**: Styled confirmation and edit dialogs

### Technical Features
- **Type-Safe**: Full TypeScript implementation across frontend and backend
- **Optimized Queries**: Database indexes on date, project, and composite fields
- **Docker Ready**: Multi-stage builds with Docker Compose orchestration
- **CI/CD Pipeline**: Automated build, lint, and Docker verification via GitHub Actions
- **API Proxy**: Next.js rewrites handle CORS seamlessly

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

## API Endpoints

Base URL: `http://localhost:3001`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/entries` | Get entries (supports filtering & pagination) |
| GET | `/entries/:id` | Get single entry |
| GET | `/entries/total-hours?date=YYYY-MM-DD` | Get daily total hours |
| POST | `/entries` | Create new entry |
| PUT | `/entries/:id` | Update entry |
| DELETE | `/entries/:id` | Delete entry |

### Query Parameters for GET /entries
- `project` - Filter by project name
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

## Project Structure
```
mini-time-tracker/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── src/
│   │   ├── entries/           # Time entry module (controller, service, DTOs)
│   │   ├── filters/           # Global exception handling
│   │   ├── main.ts            # Application bootstrap
│   │   └── prisma.service.ts  # Database service
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js pages
│   │   ├── components/        # React components (form, history, dialogs)
│   │   └── lib/               # API client, utilities, constants
│   ├── Dockerfile
│   └── package.json
├── .github/workflows/
│   └── ci.yml                 # GitHub Actions CI/CD
├── docker-compose.yml         # Service orchestration
├── start-dev.sh               # Development startup script
└── stop-dev.sh                # Development shutdown script
```