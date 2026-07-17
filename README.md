# Employee Management System (EMS)

A full-stack employee management platform with role-based access control, organizational hierarchy visualization, and bulk import capabilities.

## Features

- **Employee CRUD** — Create, read, update, soft-delete employees with form validation
- **Role-Based Access Control** — Three roles (super_admin, hr_manager, employee) with field-level permissions
- **Organization Hierarchy** — Interactive tree view with search, expand/collapse, and depth controls
- **Dashboard** — Stats cards, department distribution chart, recent activity feed
- **CSV Import** — Bulk import employees from CSV files with row-level validation
- **Profile Images** — File upload with drag-and-drop and base64 preview
- **Sorting & Filtering** — Sortable table headers, filter by department/status/role, full-text search
- **Pagination** — Page numbered buttons with ellipsis for large datasets
- **Dark Mode** — System-preference-based theme switching
- **Responsive Design** — Mobile-friendly layouts across all pages

## Tech Stack

- **Framework:** Next.js 16 (App Router, React Server Components)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui, Recharts
- **State:** TanStack Query (server state), React Hook Form (forms)
- **Database:** PostgreSQL 16, Drizzle ORM
- **Auth:** better-auth (email/password)
- **Language:** TypeScript 5
- **Runtime:** Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- [Docker](https://docker.com) (for PostgreSQL)

### Setup

```bash
# Clone and install
git clone <repo-url>
cd ems-next
bun install

# Start PostgreSQL
docker compose up -d

# Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# Run migrations
bun run db:push

# Seed database
bun run db:seed

# Start dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

### Default Accounts

| Email            | Password    | Role        |
| ---------------- | ----------- | ----------- |
| admin@ems.dev    | password123 | super_admin |
| hr@ems.dev       | password123 | hr_manager  |
| employee@ems.dev | password123 | employee    |

## Project Structure

```
app/
├── (auth)/               # Login page
├── (dashboard)/          # Protected dashboard routes
│   ├── dashboard/        # Dashboard page
│   ├── employees/        # Employee list + detail pages
│   └── organization/     # Org tree view
├── api/                  # API route handlers
│   ├── auth/             # better-auth catch-all
│   ├── dashboard/        # Dashboard summary
│   ├── employees/        # Employee endpoints
│   └── organization/     # Org tree endpoint
└── layout.tsx            # Root layout

features/
├── auth/                 # Auth hooks and session management
├── dashboard/            # Dashboard components, hooks, service
├── employees/            # Employee feature (components, hooks, server)
│   ├── components/       # UI components
│   ├── hooks/            # React hooks (queries, mutations)
│   ├── server/           # Service, repository, actions
│   ├── schemas/          # Zod validation schemas
│   └── types/            # TypeScript types
└── organization/         # Org tree feature

server/
├── auth/                 # Authorization logic (RBAC)
├── db/                   # Drizzle schema, migrations, seed
└── lib/                  # Shared utilities
```

## RBAC Matrix

| Field       | super_admin | hr_manager | employee (self) | employee (other) |
| ----------- | :---------: | :--------: | :-------------: | :--------------: |
| firstName   |     R/W     |    R/W     |        R        |        R         |
| lastName    |     R/W     |    R/W     |        R        |        R         |
| email       |     R/W     |    R/W     |        R        |        R         |
| phone       |     R/W     |    R/W     |       R/W       |        -         |
| department  |     R/W     |    R/W     |        R        |        R         |
| designation |     R/W     |    R/W     |        R        |        R         |
| salary      |     R/W     |    R/W     |        R        |        -         |
| status      |     R/W     |    R/W     |        R        |        R         |
| managerId   |     R/W     |    R/W     |        R        |        R         |

R = Read, W = Write

## Testing

```bash
# Unit tests
bun run test

# E2E tests (requires running app)
bun run test:e2e
```

## Docker

```bash
# Start PostgreSQL only
docker compose up -d postgres

# Start full app (builds Next.js image)
docker compose up --build
```

## Scripts

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `bun dev`          | Start development server     |
| `bun run build`    | Production build             |
| `bun run lint`     | Run ESLint                   |
| `bun run test`     | Run Vitest unit tests        |
| `bun run test:e2e` | Run Playwright E2E tests     |
| `bun run db:push`  | Push schema to database      |
| `bun run db:seed`  | Seed database with test data |
| `bun run format`   | Format code with Prettier    |
