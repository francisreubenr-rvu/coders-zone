import type { Lang } from "./problems";

// Code execution via Paiza.IO's public runner (free "guest" key, no signup).
// The public Piston API went whitelist-only in Feb 2026, so we use Paiza here.
// Swap providers by changing this file only — the route handlers are unchanged.
const PAIZA = process.env.PAIZA_URL || "https://api.paiza.io";
const KEY = process.env.PAIZA_KEY || "guest";

const LANG: Record<Lang, string> = { python: "python3", c: "c", cpp: "cpp", java: "java" };

export type RunResult = {
  ok: boolean;
  stdout: string;
  stderr: string;
  compileError?: string;
  message?: string;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Run a single program against one stdin. */
export async function runCode(lang: Lang, source: string, stdin: string): Promise<RunResult> {
  try {
    const createBody = new URLSearchParams({
      source_code: source,
      language: LANG[lang],
      input: stdin,
      api_key: KEY,
      longpoll: "true",
      longpoll_timeout: "12",
    });
    const createRes = await fetch(`${PAIZA}/runners/create`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: createBody,
      cache: "no-store",
    });
    if (createRes.status === 429) return { ok: false, stdout: "", stderr: "", message: "Code runner is busy — wait a moment and try again." };
    if (!createRes.ok) return { ok: false, stdout: "", stderr: "", message: `Code runner error (${createRes.status}).` };

    const created = await createRes.json();
    if (created.error) return { ok: false, stdout: "", stderr: "", message: String(created.error) };
    const id = created.id as string;

    // Poll until completed (longpoll usually returns completed already).
    let status = created.status as string;
    for (let i = 0; i < 15 && status !== "completed"; i++) {
      await sleep(700);
      const st = await fetch(`${PAIZA}/runners/get_status?id=${encodeURIComponent(id)}&api_key=${KEY}`, { cache: "no-store" });
      const sj = await st.json();
      status = sj.status;
      if (sj.error) return { ok: false, stdout: "", stderr: "", message: String(sj.error) };
    }
    if (status !== "completed") return { ok: false, stdout: "", stderr: "", message: "Code runner timed out." };

    const detRes = await fetch(`${PAIZA}/runners/get_details?id=${encodeURIComponent(id)}&api_key=${KEY}`, { cache: "no-store" });
    const d = await detRes.json();

    const buildFailed = d.build_exit_code != null && String(d.build_exit_code) !== "0";
    let compileError = buildFailed ? String(d.build_stderr || d.build_stdout || "Compilation failed") : undefined;

    const stdout = String(d.stdout ?? "");
    const stderr = String(d.stderr ?? "");
    const runFailed = !buildFailed && String(d.exit_code ?? "0") !== "0";

    // Interpreted languages (Python, etc.) have no build step, so a syntax error or
    // uncaught exception only shows up here as a non-zero exit code + stderr traceback.
    // Treat that the same as a compile error for UI purposes — but only when stdout is
    // empty, since non-empty stdout means the program ran partway and some tests may
    // still be worth showing (stderr is surfaced per-test in that case instead).
    if (!compileError && runFailed && stdout.trim() === "" && stderr.trim() !== "") {
      compileError = stderr;
    }

    return {
      ok: !compileError && !runFailed && d.result !== "failure",
      stdout,
      stderr,
      compileError,
    };
  } catch (e) {
    return { ok: false, stdout: "", stderr: "", message: `Could not reach the code runner: ${(e as Error).message}` };
  }
}
