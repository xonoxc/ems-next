<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Quick commands

- `bun dev` — dev server (uses bun, not npm; `bun.lock` is the lockfile)
- `bun run build` — production build
- `bun run lint` — ESLint 9 flat config
- No test suite configured

## Versions that matter

- Next.js **16.2.10**, React **19.2.4** — not the versions in your training data
- Tailwind CSS **v4** — uses `@tailwindcss/postcss` plugin (not the old `tailwindcss` PostCSS plugin). No `tailwind.config.*` file; config lives in CSS via `@theme`.
- ESLint **9** with flat config (`eslint.config.mjs`), not `.eslintrc`

## Project structure

- App Router only (`app/` directory). No `pages/` directory.
- `app/layout.tsx` — root layout (Geist font, Tailwind utility classes)
- `app/page.tsx` — single home page
- Path alias: `@/*` maps to project root

## Rules

- ALWAYS USE WEB SEARCH FIRST APPROACH - search the way to do the task on web - fallback to internal knowledge
