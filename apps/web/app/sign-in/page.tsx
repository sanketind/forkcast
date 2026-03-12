import Link from "next/link";

import { signInAction } from "./actions";

export default function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  return (
    <AuthShell
      title="Sign in to Forkcast"
      subtitle="Your restaurant co-pilot — know tomorrow before it arrives."
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
      <div className="auth-card panel">
        <div className="auth-brand">
          <p className="eyebrow">Restaurant AI Co-pilot</p>
          <h2 className="auth-title">{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>
        </div>

        {error && (
          <div className="auth-error">
            {decodeURIComponent(error)}
          </div>
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

          <button className="button button-full" type="submit">
            {submitLabel}
          </button>
        </form>

        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </div>
  );
}
