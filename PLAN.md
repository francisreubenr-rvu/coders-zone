# Coder's Zone — Improvement Plan Checkpoint

Source: 3 parallel audits (architecture/product/security) → Opus recalibration → live Playwright
testing (4 agents) → Opus final PR plan → implementation. See conversation history for full
reasoning; this file tracks execution state only.

## Done and verified (live, not just typechecked)

- **PR1** — `judge/route.ts`: parallelized per-test execution via `Promise.all` (was sequential
  `for`, risked the 60s serverless timeout). Verified: judge calls now 1.2-1.6s.
- **PR2** — `rate-limit.ts` (new) + all 4 API routes + `next.config.ts`: per-IP rate limiting,
  20k-char payload cap, security headers. Verified: 429/413 render as friendly UI text.
- **PR0-nav** — `nav.tsx`: mobile hamburger menu (was fully unreachable nav below 760px).
- **PR0-hydration** — `layout.tsx`: `suppressHydrationWarning` on `<html>` (theme SSR mismatch).
- **PR-Exam** — `exam/page.tsx`: removed fake `admin123` gate (relabeled tab "Author"), fixed
  dead localStorage write (grade now rehydrates on reload, keyed by exam title+createdAt),
  added `beforeunload` guard while an attempt is in progress, added confirm() before unpublish.
- **PR5-solver** — `solver/page.tsx` + `api/solve/route.ts`: solver now requires a student's own
  `attempt` before it will generate a solution (client-disabled button + server-side 400 guard).
  AI prompt now references the student's attempt.
- **PR6** — `lib/normalize.ts` (new, extracted from judge/route.ts), `lib/normalize.test.ts`,
  `lib/ai.test.ts`, vitest added as devDependency. 9/9 tests passing.
- **PR3** — `problems.ts`: added 4 problems (nth-fibonacci Medium, two-sum Medium, coin-change
  Hard, connected-regions Hard) to the existing 6 Easy-only ones — 10 total, 6 Easy/2 Medium/2
  Hard. All 16 language×problem combinations (python/c/cpp/java) verified `allPassed:true`
  against the live `/api/judge` endpoint (real Paiza compiler, not assumed).

- **PR4** — `piston.ts`, `problem-workspace.tsx`, `lib/diff.ts` (new):
  1. Interpreted-language runtime/syntax errors (e.g. Python `SyntaxError`) now populate
     `compileError` when the run exits non-zero with empty stdout + non-empty stderr, so they
     hit the existing "✗ Compile error" banner instead of a silent "0/N wrong answer." Partial-
     output-then-crash cases now show `stderr` inline under the failing test's expected/got diff.
  2. `lib/diff.ts` — deterministic (no LLM) classifier: empty-output, line-count-mismatch,
     off-by-one, whitespace-collapse, case-insensitive-match. Rendered as an amber hint under
     failed non-hidden tests.
  3. Cross-language "Compare" toggle in the revealed-solution panel — shows two languages'
     solutions side by side using the already-computed `problem.solution` object.
  All verified live: reproduced the original Python bug via curl, confirmed the fix; confirmed
  the off-by-one hint fires on a deliberately broken FizzBuzz; confirmed Compare renders two
  language panes side by side. Zero console errors across the flow.

## Status: all 7 planned PRs complete

Final full-repo check (this session): `tsc --noEmit` clean, `eslint .` clean (only the 3
pre-existing errors), `vitest run` 9/9 passing, `npm run build` clean (21 static pages,
confirming all 10 problems build), all 8 routes spot-checked live at 200.

**Nothing has been git-committed.** All work is in the working tree of the fork at
`co-projects/coders-zone`. Next steps are the user's call: review the diff, commit, and decide
whether/when to push to the fork and open a PR upstream (per this brain's co-projects workflow —
confirm before pushing/PRing, per CLAUDE.md).

## Notes for whoever resumes this

- Dev server convention used throughout this session: kill port 3000 first
  (`lsof -ti:3000 | xargs kill`), delete AppleDouble files
  (`find . -name '._*' -delete` — this SSD volume regenerates them constantly, re-run before
  every lint pass), then `npm run dev` in background, `sleep 4`, then curl to confirm routes.
- This is a personal fork with zero production traffic — Opus's explicit recalibration cut
  DB migration, Zod-everywhere validation, server-side judge re-verification, and a
  spaced-repetition engine as disproportionate effort for this project's scale. Do not
  reintroduce that scope without a reason traffic/scale has actually changed.
- No `.env.local` exists in this repo — AI features (explain/solve) run in fallback/builtin
  mode and Supabase auth is disabled. This is expected, not a bug, unless the user adds keys.
