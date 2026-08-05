# Celebration Countdown

npm workspaces monorepo for Celebration Countdown — NestJS API, Vite frontend, Expo mobile, Prisma ORM, and a Storybook design system.

## Structure

```
apps/
  backend/     NestJS API (@celebrationcountdown/backend)
  frontend/    Vite + React (@celebrationcountdown/frontend)
  mobile/      Expo + expo-router (@celebrationcountdown/mobile)
packages/
  orm/         Prisma 7 shared client (@celebrationcountdown/orm)
  shared/      Shared types and utilities (@celebrationcountdown/shared)
  ui/          Storybook design system (@celebrationcountdown/ui)
docker/        Local Postgres
```

## Prerequisites

- Node.js `>=22.12.0` (see `.nvmrc`)
- npm `>=10`
- Docker (for local Postgres)

## Setup

```bash
nvm use
npm install

cp .env.example .env
cp packages/orm/.env.example packages/orm/.env
cp apps/backend/.env.development.example apps/backend/.env.development

npm run build:shared
npm run build:orm
npm run build:ui

npm run db:up
npm run db:migrate
```

## Development

| Command | Description |
|---|---|
| `npm run dev:backend` | NestJS API on port `3001` |
| `npm run dev:frontend` | Vite app on port `3000` |
| `npm run dev:mobile` | Expo mobile |
| `npm run storybook` | UI Storybook on port `6006` |

## Database

| Command | Description |
|---|---|
| `npm run db:up` | Start Postgres |
| `npm run db:down` | Stop Postgres |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations (dev) |
| `npm run db:deploy` | Deploy migrations |
| `npm run db:studio` | Open Prisma Studio |

Default connection string:

```
postgresql://postgres:postgres@localhost:5432/celebrationcountdown?schema=public
```

## Build & checks

```bash
npm run build
npm run typecheck
npm run lint
```

## Package notes

- **Backend** follows Nest conventions: `load-env`, URI versioning (`/v1`), Joi-validated config under `config/`, and a global Prisma provider using `@prisma/adapter-pg`.
- **ORM** publishes the generated client to `dist/generated/client`. Import as `@celebrationcountdown/orm/dist/generated/client`.
- **UI** is the design-system package. Add components under `packages/ui/src/` with co-located stories and export them from `src/index.ts`.
