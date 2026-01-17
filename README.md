# Mini Time Tracker

A simple web application for tracking work hours across different projects.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS.
- **Backend**: NestJS, REST API.
- **Database**: SQLite with Prisma ORM.
- **Validation**: class-validator (Backend) and React state (Frontend).

## Prerequisites

- **Node.js**: v20.9.0 or higher (Required for Next.js 15).
- **npm**: v10 or higher.

## Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd mini-time-tracker
```

### 2. Setup Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev
```
The backend will run on `http://localhost:3001`.

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:3000`.

## Architecture

### Backend
- **NestJS**: Modular architecture with `EntriesModule` handling the business logic.
- **Prisma**: Used for type-safe database access and migrations.
- **Validation**: 
  - `CreateEntryDto` ensures all fields are present and valid.
  - `EntriesService` implements the 24-hour limit per calendar date.

### Frontend
- **Next.js App Router**: Modern routing and server/client component separation.
- **Tailwind CSS**: Custom UI components for a premium look and feel.
- **API Client**: Typed fetch wrapper for interacting with the backend.

## Features
- Add time entries with date, project, hours, and description.
- View history grouped by date.
- Automatic calculation of daily totals and grand total.
- Validation for maximum 24 hours per day.