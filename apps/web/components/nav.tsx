import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export async function AppNav() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <nav className="nav-shell">
      <div className="nav-brand">
        <Link href="/" style={{ textDecoration: "none" }}>
          <p className="eyebrow">Restaurant AI Co-pilot</p>
          <h1>Forkcast</h1>
        </Link>
      </div>

      <div className="nav-links">
        {user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/settings">Settings</Link>
            <span className="nav-email">{user.email}</span>
            <form action="/api/auth/sign-out" method="POST">
              <button type="submit" className="nav-signout">
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/">Home</Link>
            <Link href="/sign-in">Sign in</Link>
            <Link href="/sign-up" className="button nav-cta">
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
