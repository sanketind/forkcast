"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ForkcastIcon } from "@/components/logo";

export function MarketingNav({ isAuthed = false }: { isAuthed?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 20);
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <header className={`marketing-header ${scrolled ? "scrolled" : ""}`}>
        <div className="marketing-header-inner">
          <Link href="/" className="marketing-logo" onClick={close}>
            <div className="logo-icon"><ForkcastIcon size={16} color="#ffffff" /></div>
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
                <Link href="/sign-in" className="button ghost marketing-nav-signin">
                  Sign in
                </Link>
                <Link href="/sign-up" className="button">
                  Start free
                </Link>
              </>
            )}

            <button
              className="mobile-menu-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <>
                    <line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="16" y1="2" x2="2" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <line x1="2" y1="4.5" x2="16" y2="4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="2" y1="13.5" x2="16" y2="13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={close}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <nav className="mobile-menu-nav">
              <Link href="/#how-it-works" className="mobile-menu-link" onClick={close}>
                How it works
              </Link>
              <Link href="/#features" className="mobile-menu-link" onClick={close}>
                Features
              </Link>
              <Link href="/#pricing" className="mobile-menu-link" onClick={close}>
                Pricing
              </Link>
              <Link href="/#accuracy" className="mobile-menu-link" onClick={close}>
                Accuracy
              </Link>
            </nav>
            <div className="mobile-menu-cta">
              {isAuthed ? (
                <Link
                  href="/dashboard"
                  className="button button-lg"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={close}
                >
                  Go to dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="button ghost button-lg"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={close}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="button button-lg"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={close}
                  >
                    Start free — no card needed
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function AppNav() {
  return null;
}
