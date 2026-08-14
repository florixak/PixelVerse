# PixelVerse — Agent Guide

Community platform for pixel artists: posts, follows, topics, reactions, reports, and AI-assisted moderation.

## Stack

- **Framework:** Next.js 15 App Router, React 19, TypeScript
- **Package manager:** pnpm (use this; do not assume npm/yarn workspaces)
- **Auth:** Clerk
- **Data:** Sanity (source of truth — no SQL / Prisma / Drizzle)
- **AI:** Vercel AI SDK (moderation only)
- **Client cache:** TanStack Query
- **UI:** Tailwind CSS 4, shadcn/ui (new-york), Radix
- **Import alias:** `@/*` → repo root

Env vars and setup: see [README.md](README.md). Do not commit `.env.local`.

## Commands

```bash
pnpm install
pnpm dev          # Turbopack → localhost:3000
pnpm build
pnpm lint
pnpm typegen      # after Sanity schema changes → schema.json + sanity.types.ts
```

No `test` or `typecheck` scripts; no automated test suite.

## Layout

| Path | Role |
| --- | --- |
| `app/(app)/` | Product UI |
| `app/(admin)/` | Admin dashboard |
| `app/(sanity)/studio/` | Sanity Studio (`/studio`) |
| `actions/` | Server Actions (mutations) — no `app/api` routes |
| `sanity/schemaTypes/` | Document schemas |
| `sanity/lib/` | GROQ queries + clients |
| `lib/ai/` | Moderation (prompts, providers, service) |
| `lib/user-utils.ts` | Clerk → Sanity user sync |
| `components/ui/` | shadcn primitives |
| `components/` | Domain UI |
| `hooks/`, `constants/`, `types/` | Shared client hooks, enums, types |

`pnpm-workspace.yaml` is pnpm config (`allowBuilds` / `overrides`), **not** a multi-package monorepo.

## Architecture

```
RSC pages → GROQ reads (client)
Client islands → Server Actions → writeClient → Sanity
Clerk session → ensureSanityUser → Sanity user doc
```

- **Reads:** GROQ via `client` in `sanity/lib/client.ts`
- **Writes:** Server Actions + `writeClient`; then `revalidatePath` / `revalidateTag`
- **Client cache:** TanStack Query with RSC prefetch + `HydrationBoundary`
- **Auth:** Clerk middleware (`middleware.ts`); Sanity `user` docs hold `clerkId` and `role` (`user` | `moderator` | `admin`)

## Conventions

- New routes → matching route group under `app/`
- Mutations → `actions/*-actions.ts`
- Queries → `sanity/lib/<domain>/`
- New document types → schema in `sanity/schemaTypes/`, register in `sanity/schemaTypes/index.ts`, then `pnpm typegen`
- File naming: kebab-case (`post-card.tsx`, `follow-actions.ts`, `use-*.ts`)
- Do **not** hand-edit generated `sanity.types.ts` or `schema.json`
- Prefer existing shadcn primitives in `components/ui/`

## Boundaries / gotchas

- Sanity Studio returns 404 in production
- ESLint is ignored during `next build` (`eslint.ignoreDuringBuilds`) — still run `pnpm lint`
- `AI_OPTION` in code checks `"google"` (`lib/ai/provider.ts`); README says `"gemini"` — do not “fix” unless asked
- `achievementSchema.ts` exists but is **not** registered (roadmap)
- Do not put new secrets in client-exposed `NEXT_PUBLIC_*` vars beyond existing patterns

## Before finishing

1. Run `pnpm lint`
2. If Sanity schemas changed, run `pnpm typegen`
