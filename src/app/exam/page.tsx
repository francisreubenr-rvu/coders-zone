"use client";

import { useEffect, useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { problems, getProblem, LANGUAGES, type Lang } from "@/lib/problems";

const EXAM_KEY = "cz-exam";
const SUBMISSION_KEY = "cz-exam-submission";

type Exam = { title: string; slugs: string[]; createdAt: number };
type QResult = { slug: string; passed: number; total: number };

function loadExam(): Exam | null {
  try {
    const raw = localStorage.getItem(EXAM_KEY);
    return raw ? (JSON.parse(raw) as Exam) : null;
  } catch {
    return null;
  }
}

export default function ExamPage() {
  const [tab, setTab] = useState<"student" | "admin">("student");
  const [exam, setExam] = useState<Exam | null>(null);

  useEffect(() => setExam(loadExam()), []);

  return (
    <main className="cz-container" style={{ padding: "clamp(32px,5vw,64px) clamp(16px,4vw,32px) 96px", maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <div className="cz-mono" style={{ fontSize: 11, letterSpacing: ".16em", color: "var(--cz-accent)", marginBottom: 8 }}>EXAM MODE</div>
          <h1 style={{ margin: 0, fontFamily: "var(--cz-display)", fontSize: "clamp(26px,4vw,40px)", lineHeight: 1.1, letterSpacing: "-.02em", fontWeight: 700 }}>
            Sit the test. Graded on submit.
          </h1>
        </div>
        <div style={{ display: "flex", border: "1px solid var(--cz-line)", borderRadius: 8, overflow: "hidden" }}>
          {(["student", "admin"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="cz-mono"
              style={{ fontSize: 12.5, padding: "9px 16px", textTransform: "capitalize", background: tab === t ? "var(--cz-btn-bg)" : "transparent", color: tab === t ? "var(--cz-btn-fg)" : "var(--cz-soft)", border: "none", cursor: "pointer" }}
            >
              {t === "admin" ? "Author" : t}
            </button>
          ))}
        </div>
      </div>

      {tab === "admin" ? <AdminPanel exam={exam} onPublish={setExam} /> : <StudentPanel exam={exam} />}
    </main>
  );
}

/* ─────────────── Admin ─────────────── */
function AdminPanel({ exam, onPublish }: { exam: Exam | null; onPublish: (e: Exam | null) => void }) {
  const [title, setTitle] = useState(exam?.title || "Weekly Coding Test");
  const [slugs, setSlugs] = useState<string[]>(exam?.slugs || []);
  const [saved, setSaved] = useState(false);

  function toggle(slug: string) {
    setSlugs((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));
    setSaved(false);
  }

  function publish() {
    const e: Exam = { title: title.trim() || "Coding Test", slugs, createdAt: Date.now() };
    localStorage.setItem(EXAM_KEY, JSON.stringify(e));
    onPublish(e);
    setSaved(true);
  }

  function clearExam() {
    if (!confirm("Unpublish this exam? Students will lose access to it immediately.")) return;
    localStorage.removeItem(EXAM_KEY);
    onPublish(null);
    setSlugs([]);
    setSaved(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <label className="cz-mono" style={{ fontSize: 11, color: "var(--cz-faint)", letterSpacing: ".08em" }}>EXAM TITLE</label>
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setSaved(false); }}
          style={{ width: "100%", marginTop: 8, fontSize: 16, padding: "12px 14px", borderRadius: 8, border: "1px solid var(--cz-line)", background: "var(--cz-card-bg)", color: "var(--cz-fg)", fontFamily: "var(--cz-body)" }}
        />
      </div>

      <div>
        <label className="cz-mono" style={{ fontSize: 11, color: "var(--cz-faint)", letterSpacing: ".08em" }}>PICK QUESTIONS ({slugs.length} selected)</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(280px,100%),1fr))", gap: 12, marginTop: 8 }}>
          {problems.map((p) => {
            const on = slugs.includes(p.slug);
            return (
              <button
                key={p.slug}
                onClick={() => toggle(p.slug)}
                className="cz-card"
                style={{ textAlign: "left", padding: "14px 16px", cursor: "pointer", border: on ? "2px solid var(--cz-accent)" : "var(--cz-card-border)", display: "flex", flexDirection: "column", gap: 6 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--cz-display)", fontSize: 15, fontWeight: 600 }}>{p.title}</span>
                  <span className="cz-mono" style={{ fontSize: 15, color: on ? "var(--cz-accent)" : "var(--cz-faint)" }}>{on ? "✓" : "+"}</span>
                </div>
                <span className="cz-mono" style={{ fontSize: 11, color: "var(--cz-faint)" }}>{p.difficulty} · {p.topic}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button className="cz-btn" style={{ fontSize: 14 }} onClick={publish} disabled={slugs.length === 0}>Publish exam</button>
        {exam && <button className="cz-btn-ghost" style={{ fontSize: 14 }} onClick={clearExam}>Unpublish</button>}
        {saved && <span className="cz-mono" style={{ fontSize: 12.5, color: "var(--cz-green)" }}>✓ published — students can take it now</span>}
      </div>
      <p className="cz-mono" style={{ fontSize: 11, color: "var(--cz-faint)", lineHeight: 1.6, margin: 0 }}>
        Note: this demo stores the exam in this browser. For a real class (admin and students on different devices), connect Supabase — the schema is ready to extend.
      </p>
    </div>
  );
}

/* ─────────────── Student ─────────────── */
function StudentPanel({ exam }: { exam: Exam | null }) {
  const questions = (exam?.slugs || []).map(getProblem).filter(Boolean) as NonNullable<ReturnType<typeof getProblem>>[];
  const [lang, setLang] = useState<Record<string, Lang>>({});
  const [code, setCode] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<QResult[] | null>(null);

  useEffect(() => {
    // seed defaults when exam loads
    if (!exam) return;
    const l: Record<string, Lang> = {};
    const c: Record<string, string> = {};
    questions.forEach((q) => { l[q.slug] = "python"; c[q.slug] = q.starter.python; });
    setLang(l);
    setCode(c);

    // rehydrate a previously graded submission for this exact exam, if one exists
    try {
      const raw = localStorage.getItem(SUBMISSION_KEY);
      const sub = raw ? (JSON.parse(raw) as { examTitle: string; examCreatedAt?: number; results: QResult[] }) : null;
      if (sub && sub.examTitle === exam.title && sub.examCreatedAt === exam.createdAt) {
        setResults(sub.results);
        return;
      }
    } catch {}
    setResults(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam]);

  useEffect(() => {
    // warn before an in-progress, unsubmitted attempt is lost to a reload/close
    if (!exam || questions.length === 0 || results) return;
    function handler(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [exam, questions.length, results]);

  if (!exam || questions.length === 0) {
    return (
      <div className="cz-card" style={{ padding: 24, maxWidth: 520 }}>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--cz-soft)" }}>
          No exam has been posted yet. Check back when your instructor publishes one — or switch to the <strong>Author</strong> tab to post one yourself.
        </p>
      </div>
    );
  }

  function setQLang(slug: string, l: Lang) {
    const q = questions.find((x) => x.slug === slug)!;
    setLang((s) => ({ ...s, [slug]: l }));
    // only reset code to starter if student hasn't typed anything meaningful
    setCode((s) => (s[slug] === q.starter[lang[slug]] || !s[slug] ? { ...s, [slug]: q.starter[l] } : s));
  }

  async function submitExam() {
    setSubmitting(true);
    setResults(null);
    const out: QResult[] = [];
    for (const q of questions) {
      try {
        const res = await fetch("/api/judge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: q.slug, language: lang[q.slug], source: code[q.slug] }),
        });
        const d = await res.json();
        out.push({ slug: q.slug, passed: d.passed || 0, total: d.total || q.tests.length });
      } catch {
        out.push({ slug: q.slug, passed: 0, total: q.tests.length });
      }
    }
    setResults(out);
    setSubmitting(false);
    try {
      localStorage.setItem(SUBMISSION_KEY, JSON.stringify({ examTitle: exam!.title, examCreatedAt: exam!.createdAt, results: out, at: Date.now() }));
    } catch {}
  }

  const totalTests = questions.reduce((s, q) => s + q.tests.length, 0);
  const passedTests = results ? results.reduce((s, r) => s + r.passed, 0) : 0;
  const pct = results ? Math.round((passedTests / totalTests) * 100) : 0;
  const grade = pct >= 90 ? "A" : pct >= 75 ? "B" : pct >= 60 ? "C" : pct >= 40 ? "D" : "F";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="cz-card" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: "var(--cz-display)", fontSize: 22, fontWeight: 700 }}>{exam.title}</h2>
          <span className="cz-mono" style={{ fontSize: 12, color: "var(--cz-faint)" }}>{questions.length} questions · graded only after you submit</span>
        </div>
        {!results && (
          <button className="cz-btn" style={{ fontSize: 15 }} onClick={submitExam} disabled={submitting}>
            {submitting ? "Grading…" : "Submit exam ✓"}
          </button>
        )}
      </div>

      {results && (
        <div className="cz-card" style={{ padding: "22px 24px", background: "var(--cz-btn-bg)", color: "var(--cz-btn-fg)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--cz-display)", fontSize: 48, fontWeight: 800 }}>{grade}</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{pct}% — {passedTests}/{totalTests} tests passed</div>
              <div className="cz-mono" style={{ fontSize: 12, opacity: 0.8 }}>across {questions.length} questions</div>
            </div>
          </div>
        </div>
      )}

      {questions.map((q, i) => {
        const r = results?.find((x) => x.slug === q.slug);
        return (
          <div key={q.slug} className="cz-card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--cz-panel-line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h3 style={{ margin: 0, fontFamily: "var(--cz-display)", fontSize: 18, fontWeight: 600 }}>Q{i + 1}. {q.title}</h3>
                {r && (
                  <span className="cz-mono" style={{ fontSize: 13, color: r.passed === r.total ? "var(--cz-green)" : "var(--cz-amber)" }}>
                    {r.passed}/{r.total} passed
                  </span>
                )}
              </div>
              <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.55, color: "var(--cz-soft)", whiteSpace: "pre-wrap" }}>{q.statement}</p>
            </div>

            {!results && (
              <>
                <div style={{ display: "flex", borderBottom: "1px solid var(--cz-panel-line)", padding: "0 8px", overflowX: "auto" }}>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.key}
                      onClick={() => setQLang(q.slug, l.key)}
                      className="cz-mono"
                      style={{ fontSize: 12.5, padding: "10px 13px", background: "transparent", border: "none", cursor: "pointer", color: lang[q.slug] === l.key ? "var(--cz-fg)" : "var(--cz-faint)", borderBottom: lang[q.slug] === l.key ? "2px solid var(--cz-accent)" : "2px solid transparent" }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
                <CodeEditor
                  language={lang[q.slug] || "python"}
                  value={code[q.slug] ?? q.starter.python}
                  onChange={(v) => setCode((s) => ({ ...s, [q.slug]: v }))}
                  height={260}
                />
              </>
            )}
          </div>
        );
      })}

      {!results && (
        <button className="cz-btn" style={{ fontSize: 15, alignSelf: "flex-start" }} onClick={submitExam} disabled={submitting}>
          {submitting ? "Grading…" : "Submit exam ✓"}
        </button>
      )}
    </div>
  );
}
