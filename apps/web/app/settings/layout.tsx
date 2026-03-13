import type { ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOutletProfile } from "@/lib/demo-state";
import { AppSidebar } from "@/components/app-sidebar";

export default async function SettingsLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const outlet = await getOutletProfile();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata"
  });

  return (
    <div className="app-shell">
      <AppSidebar
        outletName={outlet.outletName}
        email={user?.email}
        activePath="/settings"
      />

      <div className="app-content">
        <header className="app-topbar">
          <div className="app-topbar-left">
            <span className="topbar-date">{today}</span>
          </div>
          <div className="app-topbar-right">
            {user ? (
              <form action="/api/auth/sign-out" method="POST">
                <button type="submit" className="button ghost button-sm">
                  Sign out
                </button>
              </form>
            ) : (
              <Link href="/sign-in" className="button button-sm">
                Sign in
              </Link>
            )}
          </div>
        </header>

        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}
