# job-orchestrator

A personal, single-user job-search tool: a voice/text diary that builds a
profile over time, a daily pipeline that finds and drafts tailored
application materials for matching jobs, and a chat interface for
interview-prep questions grounded in that profile. A human still submits
every application manually — nothing here auto-submits anything.

Built at strict $0 running cost. See [Architecture](#architecture) below for
how that constrains the design.

## Repo layout

```
/app        Next.js app (deployed to Vercel) — diary, chat, dashboard, settings
/pipeline   Scout / Biographer / Dispatcher / Gmail-sync (run daily by GitHub Actions)
/lib        Shared Supabase client, types, Zod schemas, prompt templates, ATS parsers
```

This repo is **public**. That's safe because none of the personal specifics —
matching criteria, target companies, resume/profile content — are ever
committed here. They live as data in Supabase. This repo only contains
generic pipeline code and prompt *templates*.

## Architecture

- **`/app`** — single Next.js (App Router) app, gated by Supabase Auth
  (single account), deployed to Vercel's free tier at the default
  `*.vercel.app` domain.
- **`/pipeline`** — runs unattended once a day via GitHub Actions cron
  (`.github/workflows/daily-pipeline.yml`), not Vercel — Playwright doesn't
  fit Vercel's Hobby-tier function limits.
- **Supabase** (Postgres + pgvector + Storage + Auth) is the single source of
  truth for everything persistent and everything personal.
- **Gemini** (free API tier) does all LLM work: audio transcription,
  embeddings, job fit-scoring, resume/cover-letter generation, application
  question drafting, Gmail thread classification.
- **Resend** (free tier) sends the daily application-material emails and
  pipeline-failure alerts.
- **Gmail** integration is read-only OAuth only — no send scope.
- **LinkedIn** sourcing is human-initiated/interactive only (e.g. a manually
  run session with a LinkedIn-connected MCP tool) — never part of the
  unattended daily pipeline, to avoid automation risk to the user's real
  account.

## Getting started

Requires accounts/keys for Supabase, Vercel, Resend, and Gemini
(Google AI Studio) — see `.env.example` for what's needed where.

```bash
npm install
npm run lint
```

- `/app`: `npm run dev --workspace=app`
- `/pipeline`: `npm run run --workspace=@job-orchestrator/pipeline` (runs Scout → Biographer → Dispatcher → Gmail sync)

## Code standards

- SOLID applied pragmatically: single-responsibility pipeline stages,
  interface-based ATS parsers (`AtsParser`), external services (Gemini,
  Resend, Supabase) accessed through small typed wrappers in `/lib`.
- Zod validation at every system boundary (env vars, API routes, scraped
  data, LLM structured outputs).
- Biome for lint/format (no ESLint/Prettier).
- New dependencies are only adopted once published for ~14 days, unless
  they're a security patch fixing a disclosed vulnerability — see git
  history for an example of that exception.
