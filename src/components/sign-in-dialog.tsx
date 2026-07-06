"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/components/auth";

export function SignInDialog({ onClose }: { onClose: () => void }) {
  const { enabled, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    const { error } = await signInWithEmail(email);
    if (error) {
      setStatus("error");
      setMessage(error);
    } else {
      setStatus("sent");
    }
  }

  // Rendered via portal: the nav's `backdropFilter` creates a new CSS containing
  // block for `position: fixed` descendants (a Chrome/Blink quirk), which traps
  // a same-tree fixed overlay inside the nav bar's own box instead of the viewport.
  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,.5)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="cz-card"
        style={{ width: "100%", maxWidth: 420, padding: 28 }}
      >
        <h3 style={{ margin: "0 0 6px", fontFamily: "var(--cz-display)", fontSize: 22, fontWeight: 700 }}>
          Sign in
        </h3>
        <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--cz-soft)", lineHeight: 1.5 }}>
          {enabled
            ? "Use your college email. We'll send you a one-tap magic link — no password to remember."
            : "Accounts aren't switched on for this deployment yet. Add Supabase keys to enable sign-in (see the README)."}
        </p>

        {status === "sent" ? (
          <div
            className="cz-mono"
            style={{ fontSize: 13, color: "var(--cz-green)", background: "var(--cz-green-bg)", border: "1px solid var(--cz-green-line)", borderRadius: 8, padding: "14px 16px", lineHeight: 1.5 }}
          >
            ✓ Check your inbox — we sent a sign-in link to <strong>{email}</strong>.
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email"
              required
              disabled={!enabled || status === "sending"}
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cz-mono"
              style={{
                fontSize: 14, padding: "12px 14px", borderRadius: 8,
                border: "1px solid var(--cz-line)", background: "var(--cz-bg)", color: "var(--cz-fg)",
              }}
            />
            {status === "error" && (
              <span style={{ fontSize: 12.5, color: "var(--cz-red)" }}>{message}</span>
            )}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
              <button type="button" className="cz-btn-ghost" style={{ fontSize: 14 }} onClick={onClose}>Cancel</button>
              <button type="submit" className="cz-btn" style={{ fontSize: 14 }} disabled={!enabled || status === "sending"}>
                {status === "sending" ? "Sending…" : "Send link"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
