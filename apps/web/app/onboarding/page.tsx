import Link from "next/link";
import { redirect } from "next/navigation";

import { OnboardingWizard } from "@/components/onboarding-wizard";
import { getOutletProfile } from "@/lib/demo-state";
import { saveOutletProfile } from "@/lib/outlet-actions";
import { getSession } from "@/lib/session";

async function saveOutletAction(formData: FormData) {
  "use server";
  await saveOutletProfile(formData);
  redirect("/onboarding");
}

function DataQualityBadge({ daysUploaded }: { daysUploaded: number }) {
  const quality = daysUploaded >= 30 ? "Excellent" : daysUploaded >= 14 ? "Good" : daysUploaded >= 7 ? "Fair" : "Needs more";
  const qualityColor = daysUploaded >= 30 ? "var(--accent)" : daysUploaded >= 14 ? "var(--accent)" : daysUploaded >= 7 ? "var(--warn)" : "#ef4444";
  const fillPct = Math.min(100, Math.round((daysUploaded / 30) * 100));

  return (
    <section className="panel" style={{ borderColor: "rgba(74, 217, 167, 0.3)" }}>
      <p className="eyebrow">Data health</p>
      <h3 style={{ marginBottom: "16px" }}>Your forecast quality</h3>
      <div style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: qualityColor, fontWeight: 700, fontSize: "1.1rem" }}>{quality}</span>
          <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>{daysUploaded} days of history</span>
        </div>
        <div style={{ height: "6px", borderRadius: "999px", background: "var(--border)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${fillPct}%`, background: qualityColor, borderRadius: "999px", transition: "width 0.4s ease" }} />
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: 0 }}>
          {daysUploaded < 7
            ? "Upload at least 7 days for a working forecast."
            : daysUploaded < 30
              ? `${30 - daysUploaded} more days of history will improve accuracy.`
              : "Your forecast has strong historical signal. Keep uploading weekly."}
        </p>
      </div>
    </section>
  );
}

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }

  const outlet = await getOutletProfile();

  return (
    <div className="grid gap-6">
      <section className="panel">
        <p className="eyebrow">Step 1</p>
        <h2>Outlet setup</h2>
        <p className="lead">
          Capture the minimum operating profile needed for forecasting and recommendation quality.
        </p>
        <form action={saveOutletAction} className="form-grid">
          <label className="field">
            <span>Outlet name</span>
            <input className="text-input" name="outletName" defaultValue={outlet.outletName} />
          </label>
          <label className="field">
            <span>City</span>
            <input className="text-input" name="city" defaultValue={outlet.city} />
          </label>
          <label className="field">
            <span>State</span>
            <input className="text-input" name="state" defaultValue={outlet.state} />
          </label>
          <label className="field">
            <span>Cuisine</span>
            <input className="text-input" name="cuisine" defaultValue={outlet.cuisine} />
          </label>
          <label className="field">
            <span>Seats</span>
            <input className="text-input" name="seats" type="number" defaultValue={outlet.seats} />
          </label>
          <div className="field">
            <span>&nbsp;</span>
            <button className="button" type="submit">
              Save outlet profile
            </button>
          </div>
        </form>
      </section>

      <OnboardingWizard outletProfile={outlet} />

      {outlet.outletId && <DataQualityBadge daysUploaded={0} />}

      <section className="panel">
        <p className="eyebrow">What happens next</p>
        <h3>After you import data</h3>
        <ul className="stack-list">
          <li>Calendar and weather signals are generated for {outlet.city}.</li>
          <li>Top SKUs are matched to recipe ingredients for your daily shopping list.</li>
          <li>
            Tomorrow&apos;s forecast is turned into inventory, staffing, and action cards.
          </li>
        </ul>
        <Link className="button secondary" href="/dashboard" style={{ display: "inline-block", marginTop: "8px" }}>
          Skip to dashboard demo
        </Link>
      </section>
    </div>
  );
}
