/**
 * Shared package consumed by both `/app` (Vercel) and `/pipeline` (GitHub Actions).
 *
 * Deliberately empty for now — real exports (Supabase client, Zod schemas,
 * prompt templates, ATS parsers) land in the "Supabase schema + shared types"
 * build step, not in this scaffolding pass. Keeping the package wired up now
 * so `/app` and `/pipeline` can already depend on it via the npm workspace.
 */
export const LIB_PLACEHOLDER = true;
