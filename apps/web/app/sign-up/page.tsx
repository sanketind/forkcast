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
      <div className="auth-card panel">
        <div className="auth-brand">
          <p className="eyebrow">Restaurant AI Co-pilot</p>
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">
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

          <button className="button button-full" type="submit">
            Create account &amp; set up restaurant
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link href="/sign-in" className="accent-link">
              Sign in
            </Link>
          </p>
          <p className="auth-terms">
            By signing up you agree to use this product responsibly.
            Your POS data is stored securely and never shared.
          </p>
        </div>
      </div>
    </div>
  );
}
