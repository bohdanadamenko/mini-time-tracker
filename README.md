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
│   ├── prisma/       # Database schema
│   └── src/entries/  # Time entry module
├── frontend/         # Next.js app
│   └── src/
│       ├── components/
│       └── lib/
└── docker-compose.yml
```

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
