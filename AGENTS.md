<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Analytics Dashboard

Production style SaaS analytics dashboard (Next.js App Router, TypeScript, React, Tailwind). Mock API backed by JSON seed data under `data/seed/`.

## Build approach

**Tracer Bullet**: data → API route → service layer → UI, one path first, then widen.

## Agent skills

Before UI work: `using-superpowers` → **creative-design** → **frontend-design** → **web-design-guidelines**. See `docs/scope/scope.md`.

| Skill | Path |
| --- | --- |
| creative-design | `.cursor/skills/creative-design/` |
| frontend-design | `.cursor/skills/frontend-design/` |
| web-design-guidelines | `.cursor/skills/web-design-guidelines/` |
| react-best-practices | `.cursor/skills/react-best-practices/` |
| composition-patterns | `.cursor/skills/composition-patterns/` |

## UI stack

- **Tailwind CSS v4** (`app/globals.css`, `@theme inline`)
- **shadcn/ui** (`components.json`, style `base-nova`, icons `lucide-react`)
- Add components: `pnpm dlx shadcn@latest add <name>` (follow the shadcn skill / Critical Rules)
- Use `@/components/ui/*` and semantic tokens (`bg-background`, `text-muted-foreground`)

Installed UI primitives include: `button`, `card`, `badge`, `skeleton`, `sidebar`, `sheet`, `table`, `input`, `select`, `chart`, `empty`, `sonner`, `tooltip`, and related layout pieces.

## Coding standards

- **TypeScript:** `strict` in `tsconfig.json`; run `pnpm typecheck` before PRs
- **Lint:** `pnpm lint` (ESLint flat config, `eslint.config.mjs`, Next core web vitals)
- **Format:** `pnpm format` / `pnpm format:check` (Prettier, no semicolons, double quotes)
- **Imports:** `@/` alias; server only data in `lib/server/*`; UI fetches via `lib/api/*`
- **Components:** shadcn primitives in `components/ui/`; feature UI in `components/<area>/`
- **React:** Server Components by default; `"use client"` only for charts, motion, and interactivity

## Conventions

- Package manager: pnpm
- App code lives at repo root (`app/`, `components/`, `lib/`)
- `cn()` from `@/lib/utils` (shadcn)
- Strict TypeScript; prefer no semicolons in app source
- UI must not import `data/seed/*`; use `lib/server` or Route Handlers only

## Specs and scope

- Scope: `docs/scope/scope.md`
- Architecture notes: `docs/ARCHITECTURE.md`
- Specs: `docs/specs/`
