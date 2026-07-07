"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { LANGUAGES, type Lang } from "@/lib/problems";

type Solution = { code: string; explanation: string; complexity: string; language: Lang; source: string };

export default function SolverPage() {
  const [problem, setProblem] = useState("");
  const [attempt, setAttempt] = useState("");
  const [lang, setLang] = useState<Lang>("python");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sol, setSol] = useState<Solution | null>(null);
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [runOut, setRunOut] = useState<{ stdout: string; stderr: string; note?: string } | null>(null);
  const [running, setRunning] = useState(false);

  async function solve() {
    if (!problem.trim() || !attempt.trim()) return;
    setLoading(true);
    setError(null);
    setSol(null);
    setRunOut(null);
    try {
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, attempt, language: lang }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSol(data);
        setCode(data.code);
      }
    } catch {
      setError("Network error — could not reach the solver.");
    } finally {
      setLoading(false);
    }
  }

  async function run() {
    setRunning(true);
    setRunOut(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: sol?.language ?? lang, source: code, stdin }),
      });
      const d = await res.json();
      setRunOut({ stdout: d.stdout ?? "", stderr: d.compileError || d.stderr || "", note: d.message });
    } catch {
      setRunOut({ stdout: "", stderr: "", note: "Network error." });
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="cz-container" style={{ padding: "clamp(40px,6vw,72px) clamp(16px,4vw,32px) 96px", maxWidth: 900 }}>
      <div className="cz-mono" style={{ fontSize: 11, letterSpacing: ".16em", color: "var(--cz-accent)", marginBottom: 14 }}>SOLVER</div>
      <h1 style={{ margin: "0 0 12px", fontFamily: "var(--cz-display)", fontSize: "clamp(30px,4.5vw,48px)", lineHeight: 1.1, letterSpacing: "-.02em", fontWeight: 700 }}>
        Bring your own problem. Try it first.
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: 16, lineHeight: 1.6, color: "var(--cz-soft)", maxWidth: 620 }}>
        Paste a problem from your coursework or a textbook, then show your own attempt — even a partial or wrong one. The solver writes a complete, runnable program in your language, explains it, and tells you what your attempt got right — then you can run it right here with your own input.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          rows={5}
          placeholder="e.g. Read an integer n, then n integers, and print their average rounded to two decimals."
          style={{ width: "100%", fontSize: 15, lineHeight: 1.6, padding: "14px 16px", borderRadius: 10, border: "1px solid var(--cz-line)", background: "var(--cz-card-bg)", color: "var(--cz-fg)", resize: "vertical", fontFamily: "var(--cz-body)" }}
        />
        <textarea
          value={attempt}
          onChange={(e) => setAttempt(e.target.value)}
          rows={5}
          placeholder="Your attempt (even a partial or wrong one — paste what you tried)"
          style={{ width: "100%", fontSize: 15, lineHeight: 1.6, padding: "14px 16px", borderRadius: 10, border: "1px solid var(--cz-line)", background: "var(--cz-card-bg)", color: "var(--cz-fg)", resize: "vertical", fontFamily: "var(--cz-body)" }}
        />
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", border: "1px solid var(--cz-line)", borderRadius: 8, overflow: "hidden" }}>
            {LANGUAGES.map((l) => (
              <button
                key={l.key}
                onClick={() => setLang(l.key)}
                className="cz-mono"
                style={{ fontSize: 12.5, padding: "9px 14px", background: lang === l.key ? "var(--cz-btn-bg)" : "transparent", color: lang === l.key ? "var(--cz-btn-fg)" : "var(--cz-soft)", border: "none", cursor: "pointer" }}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button className="cz-btn" style={{ fontSize: 14 }} onClick={solve} disabled={loading || !problem.trim() || !attempt.trim()}>
            {loading ? "Solving…" : "Show your attempt & solve →"}
          </button>
        </div>
      </div>

      {error && (
        <div className="cz-card" style={{ marginTop: 20, padding: "16px 18px" }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--cz-amber)" }}>{error}</p>
        </div>
      )}

      {sol && (
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="cz-card" style={{ overflow: "hidden" }}>
            <div className="cz-mono" style={{ fontSize: 11, color: "var(--cz-faint)", padding: "10px 14px", borderBottom: "1px solid var(--cz-panel-line)", letterSpacing: ".08em" }}>
              SOLUTION · {sol.language.toUpperCase()}
            </div>
            <CodeEditor language={sol.language} value={code} onChange={setCode} height={300} />
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button className="cz-btn-ghost" style={{ fontSize: 14 }} onClick={run} disabled={running}>{running ? "Running…" : "▶ Run it"}</button>
            <input
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="input (stdin)"
              className="cz-mono"
              style={{ flex: 1, minWidth: 180, fontSize: 13, padding: "9px 12px", borderRadius: 8, border: "1px solid var(--cz-line)", background: "var(--cz-bg)", color: "var(--cz-fg)" }}
            />
          </div>

          {runOut && (
            <div className="cz-card" style={{ padding: "14px 16px" }}>
              {runOut.note && <div className="cz-mono" style={{ fontSize: 12, color: "var(--cz-amber)", marginBottom: 6 }}>{runOut.note}</div>}
              {runOut.stdout && <><div className="cz-mono" style={{ fontSize: 10.5, color: "var(--cz-faint)" }}>OUTPUT</div><pre className="cz-mono" style={{ margin: "4px 0 0", fontSize: 13, whiteSpace: "pre-wrap", color: "var(--cz-fg)" }}>{runOut.stdout}</pre></>}
              {runOut.stderr && <><div className="cz-mono" style={{ fontSize: 10.5, color: "var(--cz-red)", marginTop: 8 }}>ERRORS</div><pre className="cz-mono" style={{ margin: "4px 0 0", fontSize: 13, whiteSpace: "pre-wrap", color: "var(--cz-red)" }}>{runOut.stderr}</pre></>}
              {!runOut.stdout && !runOut.stderr && !runOut.note && <span className="cz-mono" style={{ fontSize: 12, color: "var(--cz-faint)" }}>(no output)</span>}
            </div>
          )}

          <div className="cz-card" style={{ padding: "18px 20px" }}>
            <div className="cz-mono" style={{ fontSize: 11, color: "var(--cz-accent)", letterSpacing: ".08em", marginBottom: 6 }}>EXPLANATION</div>
            <p style={{ margin: "0 0 12px", fontSize: 14.5, lineHeight: 1.65, color: "var(--cz-soft)" }}>{sol.explanation}</p>
            {sol.complexity && (
              <>
                <div className="cz-mono" style={{ fontSize: 11, color: "var(--cz-accent)", letterSpacing: ".08em", marginBottom: 6 }}>COMPLEXITY</div>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: "var(--cz-soft)" }}>{sol.complexity}</p>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
