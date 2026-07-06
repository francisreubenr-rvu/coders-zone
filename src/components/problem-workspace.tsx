"use client";

import { useMemo, useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { useAuth } from "@/components/auth";
import { getSupabase } from "@/lib/supabase";
import { LANGUAGES, type Lang, type Problem, type Explanation } from "@/lib/problems";
import { classifyDiff } from "@/lib/diff";

type JudgeResult = {
  total: number;
  passed: number;
  allPassed: boolean;
  compileError?: string;
  message?: string;
  results: { index: number; hidden: boolean; passed: boolean; stdin?: string; expected?: string; got?: string; stderr?: string }[];
};

const DIFF_COLOR: Record<string, string> = { Easy: "var(--cz-green)", Medium: "var(--cz-amber)", Hard: "var(--cz-red)" };

export function ProblemWorkspace({ problem }: { problem: Problem }) {
  const { user } = useAuth();
  const [lang, setLang] = useState<Lang>("python");
  const [code, setCode] = useState<Record<Lang, string>>(() => ({ ...problem.starter }));
  const [stdin, setStdin] = useState(problem.tests[0]?.stdin ?? "");
  const [runOut, setRunOut] = useState<{ stdout: string; stderr: string; note?: string } | null>(null);
  const [running, setRunning] = useState(false);
  const [judging, setJudging] = useState(false);
  const [judge, setJudge] = useState<JudgeResult | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [solLang, setSolLang] = useState<Lang>("python");
  const [compareOn, setCompareOn] = useState(false);
  const [compareLang, setCompareLang] = useState<Lang>("c");
  const [explain, setExplain] = useState<(Explanation & { source: string }) | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);

  const setLangCode = (v: string) => setCode((c) => ({ ...c, [lang]: v }));
  const defaultCompareLang = (l: Lang): Lang => (l === "python" ? "c" : "python");
  const visibleTests = useMemo(() => problem.tests.filter((t) => !t.hidden), [problem.tests]);

  async function run() {
    setRunning(true);
    setRunOut(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang, source: code[lang], stdin }),
      });
      const data = await res.json();
      setRunOut({
        stdout: data.stdout ?? "",
        stderr: data.compileError || data.stderr || "",
        note: data.message,
      });
    } catch {
      setRunOut({ stdout: "", stderr: "", note: "Network error — could not reach the code runner." });
    } finally {
      setRunning(false);
    }
  }

  async function submit() {
    setJudging(true);
    setJudge(null);
    try {
      const res = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: problem.slug, language: lang, source: code[lang] }),
      });
      const data: JudgeResult = await res.json();
      setJudge(data);
      setAttempted(true);
      saveAttempt(data.allPassed);
    } catch {
      setJudge({ total: 0, passed: 0, allPassed: false, message: "Network error — could not reach the judge.", results: [] });
    } finally {
      setJudging(false);
    }
  }

  async function saveAttempt(solved: boolean) {
    const sb = getSupabase();
    if (!sb || !user) return;
    try {
      await sb.from("attempts").insert({ user_id: user.id, problem_slug: problem.slug, language: lang, solved });
    } catch {
      /* table may not exist yet — non-fatal */
    }
  }

  async function reveal() {
    setRevealed(true);
    setSolLang(lang);
    setCompareLang(defaultCompareLang(lang));
    if (explain || explainLoading) return;
    setExplainLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: problem.slug, language: lang }),
      });
      const data = await res.json();
      setExplain(data);
    } catch {
      setExplain({ ...problem.explanation, source: "builtin" });
    } finally {
      setExplainLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(420px,100%),1fr))", gap: 24, alignItems: "start" }}>
      {/* LEFT: statement + gated solution */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <span className="cz-mono" style={{ fontSize: 11, color: DIFF_COLOR[problem.difficulty], letterSpacing: ".08em" }}>{problem.difficulty.toUpperCase()}</span>
            <span className="cz-mono" style={{ fontSize: 11, color: "var(--cz-faint)" }}>{problem.topic}</span>
          </div>
          <h1 style={{ margin: "0 0 16px", fontFamily: "var(--cz-display)", fontSize: "clamp(26px,3.6vw,36px)", fontWeight: 700, letterSpacing: "-.02em" }}>{problem.title}</h1>
          {problem.statement.split("\n\n").map((para, i) => (
            <p key={i} style={{ margin: "0 0 12px", fontSize: 15, lineHeight: 1.6, color: "var(--cz-soft)", whiteSpace: "pre-wrap" }}>{para}</p>
          ))}
        </div>

        <div className="cz-card" style={{ padding: "16px 18px" }}>
          <div className="cz-mono" style={{ fontSize: 11, color: "var(--cz-faint)", marginBottom: 10, letterSpacing: ".08em" }}>SAMPLE TESTS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {visibleTests.map((t, i) => (
              <div key={i} className="cz-mono" style={{ fontSize: 12.5, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><span style={{ color: "var(--cz-faint)" }}>input</span><pre style={{ margin: "4px 0 0", whiteSpace: "pre-wrap", color: "var(--cz-fg)" }}>{t.stdin}</pre></div>
                <div><span style={{ color: "var(--cz-faint)" }}>expected</span><pre style={{ margin: "4px 0 0", whiteSpace: "pre-wrap", color: "var(--cz-fg)" }}>{t.expected}</pre></div>
              </div>
            ))}
          </div>
        </div>

        {/* Gated solution + explanation */}
        <div className="cz-card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div className="cz-mono" style={{ fontSize: 11, color: "var(--cz-faint)", letterSpacing: ".08em" }}>WORKED SOLUTION &amp; EXPLANATION</div>
            {!revealed && (
              attempted ? (
                <button className="cz-btn" style={{ fontSize: 13, padding: "8px 16px" }} onClick={reveal}>Reveal the why →</button>
              ) : (
                <span className="cz-mono" style={{ fontSize: 11.5, color: "var(--cz-amber)" }}>🔒 attempt or skip first</span>
              )
            )}
          </div>

          {!attempted && !revealed && (
            <p style={{ margin: "12px 0 0", fontSize: 13.5, lineHeight: 1.55, color: "var(--cz-soft)" }}>
              Run your code against the tests with <strong>Submit</strong> — pass or fail, it unlocks. Or{" "}
              <button
                onClick={() => setAttempted(true)}
                className="cz-mono"
                style={{ background: "none", border: "none", padding: 0, color: "var(--cz-accent)", cursor: "pointer", fontSize: 13.5, textDecoration: "underline" }}
              >
                skip honestly
              </button>{" "}
              — we count it, no penalty.
            </p>
          )}

          {revealed && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                <button
                  onClick={() => setCompareOn((v) => !v)}
                  className="cz-mono"
                  style={{ fontSize: 11, padding: "5px 11px", borderRadius: 6, border: "1px solid var(--cz-line)", cursor: "pointer", background: compareOn ? "var(--cz-accent)" : "transparent", color: compareOn ? "var(--cz-bg)" : "var(--cz-faint)" }}
                >
                  {compareOn ? "✓ Compare" : "Compare"}
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: compareOn ? "repeat(auto-fit,minmax(min(240px,100%),1fr))" : "1fr", gap: 16 }}>
                <div>
                  <div style={{ display: "flex", borderBottom: "1px solid var(--cz-panel-line)", marginBottom: 12, overflowX: "auto" }}>
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.key}
                        onClick={() => setSolLang(l.key)}
                        className="cz-mono"
                        style={{ fontSize: 12, padding: "8px 13px", background: "transparent", border: "none", cursor: "pointer", whiteSpace: "nowrap", color: solLang === l.key ? "var(--cz-fg)" : "var(--cz-faint)", borderBottom: solLang === l.key ? "2px solid var(--cz-accent)" : "2px solid transparent" }}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                  <pre className="cz-mono" style={{ margin: 0, padding: 14, fontSize: 12.5, lineHeight: 1.7, background: "var(--cz-bg)", borderRadius: 8, border: "1px solid var(--cz-line)", overflowX: "auto", color: "var(--cz-syn-plain)" }}>
                    {problem.solution[solLang]}
                  </pre>
                </div>

                {compareOn && (
                  <div>
                    <div style={{ display: "flex", borderBottom: "1px solid var(--cz-panel-line)", marginBottom: 12, overflowX: "auto" }}>
                      {LANGUAGES.map((l) => (
                        <button
                          key={l.key}
                          onClick={() => setCompareLang(l.key)}
                          className="cz-mono"
                          style={{ fontSize: 12, padding: "8px 13px", background: "transparent", border: "none", cursor: "pointer", whiteSpace: "nowrap", color: compareLang === l.key ? "var(--cz-fg)" : "var(--cz-faint)", borderBottom: compareLang === l.key ? "2px solid var(--cz-accent)" : "2px solid transparent" }}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                    <pre className="cz-mono" style={{ margin: 0, padding: 14, fontSize: 12.5, lineHeight: 1.7, background: "var(--cz-bg)", borderRadius: 8, border: "1px solid var(--cz-line)", overflowX: "auto", color: "var(--cz-syn-plain)" }}>
                      {problem.solution[compareLang]}
                    </pre>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
                {explainLoading && <span className="cz-mono" style={{ fontSize: 12.5, color: "var(--cz-faint)" }}>Writing the explanation…</span>}
                {explain && (
                  <>
                    {([["Intuition", explain.intuition], ["Approach", explain.approach], ["Walkthrough", explain.walkthrough], ["Complexity", explain.complexity]] as const).map(([h, body]) => (
                      <div key={h}>
                        <div className="cz-mono" style={{ fontSize: 11, color: "var(--cz-accent)", letterSpacing: ".08em", marginBottom: 5 }}>{h.toUpperCase()}</div>
                        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--cz-soft)" }}>{body}</p>
                      </div>
                    ))}
                    <span className="cz-mono" style={{ fontSize: 10.5, color: "var(--cz-faint)" }}>
                      {explain.source === "ai" ? "explained by Claude" : "built-in explanation · add an Anthropic key for AI walkthroughs"}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: editor + run/submit + results */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="cz-card" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--cz-panel-line)", padding: "0 8px", overflowX: "auto" }}>
            {LANGUAGES.map((l) => (
              <button
                key={l.key}
                onClick={() => setLang(l.key)}
                className="cz-mono"
                style={{ fontSize: 12.5, padding: "11px 14px", background: "transparent", border: "none", cursor: "pointer", whiteSpace: "nowrap", color: lang === l.key ? "var(--cz-fg)" : "var(--cz-faint)", borderBottom: lang === l.key ? "2px solid var(--cz-accent)" : "2px solid transparent" }}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => setCode((c) => ({ ...c, [lang]: problem.starter[lang] }))}
              className="cz-mono"
              style={{ marginLeft: "auto", fontSize: 11, padding: "6px 10px", background: "transparent", border: "none", cursor: "pointer", color: "var(--cz-faint)" }}
            >
              ↺ reset
            </button>
          </div>
          <CodeEditor language={lang} value={code[lang]} onChange={setLangCode} />
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button className="cz-btn-ghost" style={{ fontSize: 14 }} onClick={run} disabled={running || judging}>
            {running ? "Running…" : "▶ Run"}
          </button>
          <button className="cz-btn" style={{ fontSize: 14 }} onClick={submit} disabled={judging || running}>
            {judging ? "Judging…" : "Submit ✓"}
          </button>
          <span className="cz-mono" style={{ fontSize: 11, color: "var(--cz-faint)" }}>runs on a real compiler</span>
        </div>

        {/* custom run input + console */}
        <div className="cz-card" style={{ padding: "14px 16px" }}>
          <label className="cz-mono" style={{ fontSize: 11, color: "var(--cz-faint)", letterSpacing: ".08em" }}>CUSTOM INPUT (for ▶ Run)</label>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            rows={2}
            className="cz-mono"
            style={{ width: "100%", marginTop: 8, fontSize: 12.5, padding: "8px 10px", borderRadius: 6, border: "1px solid var(--cz-line)", background: "var(--cz-bg)", color: "var(--cz-fg)", resize: "vertical" }}
          />
          {runOut && (
            <div style={{ marginTop: 12 }}>
              {runOut.note && <div className="cz-mono" style={{ fontSize: 12, color: "var(--cz-amber)", marginBottom: 6 }}>{runOut.note}</div>}
              {runOut.stdout && <><div className="cz-mono" style={{ fontSize: 10.5, color: "var(--cz-faint)" }}>OUTPUT</div><pre className="cz-mono" style={{ margin: "4px 0 0", fontSize: 12.5, whiteSpace: "pre-wrap", color: "var(--cz-fg)" }}>{runOut.stdout}</pre></>}
              {runOut.stderr && <><div className="cz-mono" style={{ fontSize: 10.5, color: "var(--cz-red)", marginTop: 8 }}>ERRORS</div><pre className="cz-mono" style={{ margin: "4px 0 0", fontSize: 12.5, whiteSpace: "pre-wrap", color: "var(--cz-red)" }}>{runOut.stderr}</pre></>}
              {!runOut.stdout && !runOut.stderr && !runOut.note && <span className="cz-mono" style={{ fontSize: 12, color: "var(--cz-faint)" }}>(no output)</span>}
            </div>
          )}
        </div>

        {/* judge results */}
        {judge && (
          <div className="cz-card" style={{ padding: "16px 18px" }}>
            {judge.compileError ? (
              <>
                <div className="cz-mono" style={{ fontSize: 13, color: "var(--cz-red)", marginBottom: 8 }}>✗ Compile error</div>
                <pre className="cz-mono" style={{ margin: 0, fontSize: 12, whiteSpace: "pre-wrap", color: "var(--cz-red)" }}>{judge.compileError}</pre>
              </>
            ) : judge.message ? (
              <div className="cz-mono" style={{ fontSize: 13, color: "var(--cz-amber)" }}>{judge.message}</div>
            ) : (
              <>
                <div className="cz-mono" style={{ fontSize: 14, fontWeight: 600, color: judge.allPassed ? "var(--cz-green)" : "var(--cz-amber)", marginBottom: 12 }}>
                  {judge.allPassed ? "✓ Accepted" : "✗ Wrong answer"} — {judge.passed}/{judge.total} tests passed
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {judge.results.map((r) => (
                    <div key={r.index} className="cz-mono" style={{ fontSize: 12, borderTop: "1px solid var(--cz-line)", paddingTop: 8 }}>
                      <div style={{ color: r.passed ? "var(--cz-green)" : "var(--cz-red)" }}>
                        {r.passed ? "✓" : "✗"} Test {r.index + 1}{r.hidden ? " (hidden)" : ""}
                      </div>
                      {!r.passed && !r.hidden && (
                        <div style={{ marginTop: 4, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, color: "var(--cz-soft)" }}>
                          <div>expected<pre style={{ margin: "2px 0 0", whiteSpace: "pre-wrap", color: "var(--cz-green)" }}>{r.expected}</pre></div>
                          <div>got<pre style={{ margin: "2px 0 0", whiteSpace: "pre-wrap", color: "var(--cz-red)" }}>{r.got || "(empty)"}</pre></div>
                        </div>
                      )}
                      {!r.passed && !r.hidden && r.expected !== undefined && r.got !== undefined && (() => {
                        const hint = classifyDiff(r.expected, r.got);
                        return hint ? (
                          <div className="cz-mono" style={{ marginTop: 6, fontSize: 11.5, color: "var(--cz-amber)", background: "color-mix(in srgb, var(--cz-amber) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--cz-amber) 30%, transparent)", borderRadius: 6, padding: "6px 9px" }}>
                            hint — {hint}
                          </div>
                        ) : null;
                      })()}
                      {!r.passed && !r.hidden && r.stderr && (
                        <div style={{ marginTop: 6 }}>
                          <div style={{ color: "var(--cz-red)" }}>stderr</div>
                          <pre style={{ margin: "2px 0 0", whiteSpace: "pre-wrap", color: "var(--cz-red)" }}>{r.stderr}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {!judge.allPassed && !revealed && (
                  <button className="cz-btn" style={{ fontSize: 13, padding: "9px 16px", marginTop: 14 }} onClick={reveal}>
                    See the correct solution →
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
