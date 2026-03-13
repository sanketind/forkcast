import type { ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOutletProfile } from "@/lib/demo-state";
import { AppSidebar } from "@/components/app-sidebar";

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const outlet = await getOutletProfile();

  return (
    <div className="app-shell">
      <AppSidebar
        outletName={outlet.outletName}
        email={user?.email}
        activePath="/onboarding"
      />

      <div className="app-content">
        <header className="app-topbar">
          <div className="app-topbar-left">
            <span className="topbar-page-title">Upload POS Data</span>
          </div>
          <div className="app-topbar-right">
            <Link href="/dashboard" className="button ghost button-sm">
              Back to dashboard
            </Link>
          </div>
        </header>

        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}
