# Mini Time Tracker

Full-stack application for tracking work hours across projects.

## Tech Stack

**Frontend:** Next.js 16, TypeScript, Tailwind CSS v4, Radix UI
**Backend:** NestJS v11, Prisma, SQLite
**DevOps:** Docker, GitHub Actions

## Quick Start

### Docker (Recommended)
```bash
docker-compose up -d
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Manual
```bash
# Backend
cd backend && cp .env.example .env && npm install
npx prisma migrate dev --name init && npm run start:dev

# Frontend (new terminal)
cd frontend && cp .env.example .env.local && npm install && npm run dev
```

Or use scripts: `./start-dev.sh` / `./stop-dev.sh`

## Features

- Create, edit, delete time entries
- Filter by project and date range
- Pagination support
- 24-hour daily limit validation
- Dark/light theme
- Responsive design

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/entries` | List entries (supports `project`, `startDate`, `endDate`, `page`, `limit`) |
| POST | `/entries` | Create entry |
| PUT | `/entries/:id` | Update entry |
| DELETE | `/entries/:id` | Delete entry |

## Project Structure

```
├── backend/          # NestJS API
│   ├── prisma/       # Database schema and migrations
│   └── src/entries/  # Time entry module (Controller, Service, DTOs)
├── frontend/         # Next.js application
│   └── src/
│       ├── components/ # Reusable UI components
│       └── lib/        # API client and utilities
└── docker-compose.yml # Infrastructure orchestration
```

## Architecture

The project follows a **Clean Architecture** approach with a clear separation between the presentation layer (Frontend) and the business logic layer (Backend).

### Backend (NestJS)
- **Modular Design**: Organized into feature modules (e.g., `EntriesModule`) for better maintainability.
- **Service-Based Logic**: Business rules, such as the 24-hour daily limit validation, are encapsulated in services.
- **Type Safety**: Leverages TypeScript and Prisma generated types for end-to-end type safety.
- **RESTful API**: Provides a clean interface for the frontend to consume.

### Frontend (Next.js)
- **App Router**: Uses the latest Next.js features for routing and layout management.
- **Component-Driven UI**: Built with reusable React components, styled with Tailwind CSS for a consistent look and feel.
- **State Management**: Uses React hooks (`useState`, `useEffect`) for managing local state and API interactions.
- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop.

### Database (Prisma + SQLite)
- **ORM**: Prisma is used for database modeling and type-safe queries.
- **Indexing**: Database indexes are applied to `date` and `project` fields to optimize filtering and sorting performance.

## Design Decisions

- **SQLite for Development**: Chosen for its simplicity and zero-configuration setup, while being easily swappable for PostgreSQL in production thanks to Prisma.
- **Server-Side Pagination**: Implemented to ensure the application remains performant as the number of time entries grows.
- **Validation at Source**: Validation is performed on both the frontend (for immediate feedback) and the backend (for data integrity).

## Development

```bash
# Tests
cd backend && npm test

# Lint
cd backend && npm run lint
cd frontend && npm run lint

# Migrations
cd backend && npx prisma migrate dev --name migration_name
```
