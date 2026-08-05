# @celebrationcountdown/orm

Shared Prisma ORM package (Prisma 7 + `@prisma/adapter-pg`), following nabthis-orm conventions.

## Scripts

| Script | Description |
|---|---|
| `npm run prisma:generate` | Generate Prisma client into `prisma/generated/client` |
| `npm run build` | Generate, compile, and publish client to `dist/generated/client` |
| `npm run migrate:dev` | Apply migrations in development |
| `npm run migrate` | Deploy migrations |

## Consumer import

```ts
import { PrismaClient } from '@celebrationcountdown/orm/dist/generated/client'
```
