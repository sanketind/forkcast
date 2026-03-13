import Link from "next/link";

import { signUpAction } from "./actions";

export default function SignUpPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return <SignUpForm searchParams={searchParams} />;
}

async function SignUpForm({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="auth-page">
      {/* Left brand panel — coral gradient bg, all text must be white */}
      <div className="auth-brand-panel">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: "var(--on-brand-surface)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <span style={{ fontSize: "var(--text-base)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--on-brand)" }}>Forkcast</span>
        </Link>

        <div style={{ fontSize: "var(--text-2xs)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--on-brand-subtle)", marginBottom: 8 }}>Set up in 2 minutes</div>
        <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", letterSpacing: "-0.03em", marginTop: 12, marginBottom: 20, color: "var(--on-brand)", lineHeight: 1.15 }}>
          Your first forecast
          <br />
          <span style={{ color: "var(--on-brand-muted)", fontStyle: "italic" }}>tonight at 7pm.</span>
        </h2>
        <p style={{ color: "var(--on-brand-muted)", fontSize: "var(--text-base)", lineHeight: 1.7, maxWidth: 380 }}>
          Create your account, upload your POS CSV, and Forkcast starts
          working immediately. No credit card. No setup fees.
        </p>

        <div style={{ marginTop: 40, padding: "20px 24px", background: "var(--on-brand-surface)", border: "1px solid var(--on-brand-border)", borderRadius: "var(--radius-lg)" }}>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--on-brand)", fontWeight: 700, marginBottom: 12 }}>
            What happens after you sign up:
          </div>
          {[
            "Connect your Petpooja / UrbanPiper / Posist CSV",
            "Map your ingredients (5 min, one-time)",
            "Get your first forecast by 7pm today",
          ].map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--on-brand)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-2xs)", fontWeight: 800, flexShrink: 0, marginTop: 1 }}>
                {i + 1}
              </div>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--on-brand-muted)", lineHeight: 1.5 }}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div>
            <h1 style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em", marginBottom: 6, color: "var(--text)" }}>
              Create your account
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", margin: 0 }}>
              Set up Forkcast for your restaurant — takes 2 minutes.
            </p>
          </div>

          {error && (
            <div className="auth-error">{decodeURIComponent(error)}</div>
          )}

          <form action={signUpAction} className="auth-form">
            <label className="field">
              <span>Restaurant name</span>
              <input
                className="text-input"
                name="restaurantName"
                type="text"
                placeholder="FC Road Kitchen"
                required
                autoComplete="organization"
              />
            </label>

            <label className="field">
              <span>Email address</span>
              <input
                className="text-input"
                name="email"
                type="email"
                placeholder="owner@yourrestaurant.in"
                required
                autoComplete="email"
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                className="text-input"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>

            <button className="button button-full" type="submit" style={{ marginTop: 4 }}>
              Create account &amp; set up restaurant
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link href="/sign-in" className="accent-link">Sign in</Link>
            </p>
            <p className="auth-terms">
              By signing up you agree to use this product responsibly.
              Your POS data is stored securely and never shared.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
