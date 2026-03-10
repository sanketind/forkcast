import { signInAction } from "./actions";

export default function SignInPage() {
  return (
    <section className="panel">
      <p className="eyebrow">MVP auth</p>
      <h2>Sign in to the operator console</h2>
      <p className="lead">
        This seed flow creates a restaurant-owner session cookie so you can continue onboarding and
        review tomorrow&apos;s actions.
      </p>

      <form action={signInAction} className="form-grid">
        <label className="field">
          <span>Name</span>
          <input className="text-input" name="userName" defaultValue="Aditi" />
        </label>
        <label className="field">
          <span>Email</span>
          <input className="text-input" name="email" type="email" defaultValue="owner@demo-kitchen.in" />
        </label>
        <label className="field">
          <span>Password</span>
          <input className="text-input" name="password" type="password" defaultValue="demo123" />
        </label>
        <div className="field">
          <span>Continue</span>
          <button className="button" type="submit">
            Create session
          </button>
        </div>
      </form>
    </section>
  );
}
