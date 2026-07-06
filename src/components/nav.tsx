"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme";
import { useAuth } from "@/components/auth";
import { SignInDialog } from "@/components/sign-in-dialog";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Practice", href: "/practice" },
  { label: "Solver", href: "/solver" },
  { label: "Exam", href: "/exam" },
  { label: "About", href: "/#about" },
];

export function Nav() {
  const { user, enabled, signOut } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      style={{
        position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(14px)",
        background: "var(--cz-nav-bg)", borderBottom: "1px solid var(--cz-line)",
        transition: "background-color .5s ease",
      }}
    >
      <div
        className="cz-container"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", paddingTop: 14, paddingBottom: 14 }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span className="cz-mono" style={{ fontWeight: 600, fontSize: 15, letterSpacing: ".08em" }}>CODER&apos;S&nbsp;ZONE</span>
          <span className="cz-mono" style={{ fontWeight: 400, fontSize: 10, color: "var(--cz-faint)", letterSpacing: ".14em" }}>BETA</span>
        </Link>

        <div className="cz-nav-links" style={{ display: "flex", gap: 28, fontSize: 13.5, fontWeight: 500, color: "var(--cz-soft)" }}>
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} style={{ cursor: "pointer" }}>{l.label}</Link>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <ThemeToggle />
          {user ? (
            <>
              <span className="cz-mono" style={{ fontSize: 11, color: "var(--cz-faint)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </span>
              <button className="cz-btn-ghost" style={{ fontSize: 12, padding: "7px 14px" }} onClick={() => signOut()}>Sign out</button>
            </>
          ) : (
            <button
              className="cz-btn"
              style={{ fontSize: 13, padding: "9px 18px" }}
              onClick={() => setDialogOpen(true)}
            >
              {enabled ? "Sign in with college email" : "Sign in"}
            </button>
          )}
          <button
            type="button"
            className="cz-nav-toggle"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              display: "none", width: 34, height: 34, alignItems: "center", justifyContent: "center",
              border: "var(--cz-ghost-border)", borderRadius: "var(--cz-btn-radius)", background: "transparent",
              color: "var(--cz-fg)", fontSize: 15, lineHeight: 1, cursor: "pointer", flexShrink: 0,
            }}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="cz-nav-mobile-panel" style={{ display: "none" }}>
          <div className="cz-container" style={{ display: "flex", flexDirection: "column", paddingBottom: 14, borderTop: "1px solid var(--cz-line)" }}>
            {LINKS.map((l, i) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "12px 2px", fontSize: 14, fontWeight: 500, color: "var(--cz-soft)",
                  borderBottom: i < LINKS.length - 1 ? "1px solid var(--cz-line)" : "none",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {dialogOpen && <SignInDialog onClose={() => setDialogOpen(false)} />}

      <style>{`@media (max-width: 760px){
        .cz-nav-links{ display:none !important; }
        .cz-nav-toggle{ display:inline-flex !important; }
        .cz-nav-mobile-panel{ display:block !important; }
      }`}</style>
    </nav>
  );
}
