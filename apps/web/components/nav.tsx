"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function MarketingNav({ isAuthed = false }: { isAuthed?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={`marketing-header ${scrolled ? "scrolled" : ""}`}>
      <div className="marketing-header-inner">
        <Link href="/" className="marketing-logo">
          <div className="logo-icon">⚡</div>
          <span className="logo-text">Forkcast</span>
        </Link>

        <nav className="marketing-nav-links">
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#features">Features</Link>
          <Link href="/#accuracy">Accuracy</Link>
        </nav>

        <div className="marketing-nav-actions">
          {isAuthed ? (
            <Link href="/dashboard" className="button">
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="button ghost">
                Sign in
              </Link>
              <Link href="/sign-up" className="button">
                Start free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function AppNav() {
  return null;
}
