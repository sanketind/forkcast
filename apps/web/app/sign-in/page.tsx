import Link from "next/link";

import { signInAction } from "./actions";
import { ForkcastIcon } from "@/components/logo";

export default function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  return (
    <AuthShell
      title="Sign in"
      subtitle="Your restaurant co-pilot is waiting."
      searchParams={searchParams}
      formAction={signInAction}
      submitLabel="Sign in"
      footer={
        <p>
          New to Forkcast?{" "}
          <Link href="/sign-up" className="accent-link">
            Create an account
          </Link>
        </p>
      }
    />
  );
}

async function AuthShell({
  title,
  subtitle,
  searchParams,
  formAction,
  submitLabel,
  footer,
  extraFields
}: {
  title: string;
  subtitle: string;
  searchParams: Promise<{ error?: string; next?: string }>;
  formAction: (formData: FormData) => Promise<void>;
  submitLabel: string;
  footer?: React.ReactNode;
  extraFields?: React.ReactNode;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="auth-page">
      {/* Left brand panel — coral gradient bg, all text must be white */}
      <div className="auth-brand-panel">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: "var(--on-brand-surface)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><ForkcastIcon size={18} color="#ffffff" /></div>
          <span style={{ fontSize: "var(--text-base)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--on-brand)" }}>Forkcast</span>
        </Link>

        <div style={{ fontSize: "var(--text-2xs)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--on-brand-subtle)", marginBottom: 8 }}>AI co-pilot for Indian restaurants</div>
        <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", letterSpacing: "-0.03em", marginTop: 12, marginBottom: 20, color: "var(--on-brand)", lineHeight: 1.15 }}>
          Know tomorrow&apos;s revenue.
          <br />
          <span style={{ color: "var(--on-brand-muted)", fontStyle: "italic" }}>Act tonight.</span>
        </h2>
        <p style={{ color: "var(--on-brand-muted)", fontSize: "var(--text-base)", lineHeight: 1.7, maxWidth: 380 }}>
          Forkcast predicts tomorrow&apos;s sales using your POS history, festivals,
          weather, and mandi prices — then delivers a WhatsApp at 7pm with your
          shopping list and staffing plan.
        </p>

        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "📈", text: "Revenue forecast with confidence range" },
            { icon: "🛒", text: "Ingredient shopping list — exact quantities" },
            { icon: "👨‍🍳", text: "Peak-hour staffing plan" },
            { icon: "⚠️", text: "Supply alerts 2–7 days ahead" },
          ].map((item) => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--on-brand-surface)", border: "1px solid var(--on-brand-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                {item.icon}
              </div>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--on-brand-muted)" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div>
            <h1 style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em", marginBottom: 6, color: "var(--text)" }}>
              {title}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", margin: 0 }}>{subtitle}</p>
          </div>

          {error && (
            <div className="auth-error">{decodeURIComponent(error)}</div>
          )}

          <form action={formAction} className="auth-form">
            {next && <input type="hidden" name="next" value={next} />}

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
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </label>

            {extraFields}

            <button className="button button-full" type="submit" style={{ marginTop: 4 }}>
              {submitLabel}
            </button>
          </form>

          {footer && (
            <div className="auth-footer">{footer}</div>
          )}

          <div style={{ paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-sm)", color: "var(--text-secondary)", transition: "color 0.15s" }}>
              <span>→</span>
              <span>Explore demo dashboard without signing in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
