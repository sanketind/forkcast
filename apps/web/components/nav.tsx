import Link from "next/link";

export function AppNav() {
  return (
    <nav className="nav-shell">
      <div className="nav-brand">
        <p className="eyebrow">Restaurant AI Copilot</p>
        <h1>Forkcast</h1>
      </div>
      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/sign-in">Sign in</Link>
        <Link href="/onboarding">Onboarding</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/settings">Settings</Link>
      </div>
    </nav>
  );
}
