# Coder's Zone

A verified, attempt-first coding practice platform. Try a problem in **C, C++, Java or Python**, run it against real tests on a real compiler, and only then unlock a worked solution with a line-by-line explanation.

Built with Next.js 16 (App Router) + React 19. Code runs on [Paiza.IO](https://paiza.io); explanations use the Claude API; accounts use Supabase.

## What works out of the box

With **zero configuration**, `npm run dev` gives you:

- The full landing page and three practice problems.
- Real code execution + judging in all four languages (via Paiza's free `guest` runner).
- Built-in written explanations, gated behind an attempt.

Sign-in and AI explanations are optional upgrades (below).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Optional upgrades

Copy `.env.example` to `.env.local` and fill in what you want:

### AI explanations (Gemini, Claude, or local)
Set `GEMINI_API_KEY` (free, no credit card, from https://aistudio.google.com/apikey) or `ANTHROPIC_API_KEY` (from https://console.anthropic.com) and explanations/the Solver are generated per-language; without either, the hand-written explanations are used. Gemini is preferred when both are set. Optionally set `GEMINI_MODEL` (default `gemini-2.0-flash`) or `ANTHROPIC_MODEL` (default `claude-opus-4-8`; `claude-haiku-4-5` is cheaper).

For fully offline/local generation instead of a cloud key, run [Ollama](https://ollama.com) and set `LOCAL_MODEL` (e.g. `phi4-mini` — `ollama pull phi4-mini` first). This takes priority over Gemini/Claude when set. Optionally set `OLLAMA_URL` if Ollama isn't on the default `http://localhost:11434`.

### Accounts (Supabase)
1. Create a free project at https://supabase.com.
2. In the project's **SQL Editor**, run the contents of `supabase-schema.sql`.
3. Copy **Project URL** and the **anon public** key (Settings → API) into
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Sign-in uses a magic link sent to the student's email — no passwords.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import it at https://vercel.com/new.
3. Add the same environment variables (from `.env.local`) in the Vercel project settings.
4. Deploy — you get a public `https://<name>.vercel.app` URL.

## Adding problems

Everything is data-driven. Add an object to the `problems` array in
`src/lib/problems.ts` — a statement, starter + solution per language, test cases
(`stdin`/`expected`, mark some `hidden`), and a fallback explanation. It shows up
in the list and gets its own page automatically.
