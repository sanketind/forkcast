import Link from "next/link";
import { redirect } from "next/navigation";

import { OnboardingWizard } from "@/components/onboarding-wizard";
import { getOutletProfile, saveOutletProfile } from "@/lib/demo-state";
import { getSession } from "@/lib/session";

async function saveOutletAction(formData: FormData) {
  "use server";

  await saveOutletProfile(formData);
  redirect("/dashboard");
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
            <span>Next</span>
            <button className="button" type="submit">
              Save and open dashboard
            </button>
          </div>
        </form>
      </section>

      <OnboardingWizard />

      <section className="panel">
        <p className="eyebrow">Launch notes</p>
        <h3>What happens after onboarding</h3>
        <ul className="stack-list">
          <li>Calendar and weather signals are generated for the outlet city.</li>
          <li>Top SKUs are matched to recipe ingredients for purchasing guidance.</li>
          <li>Tomorrow&apos;s forecast is turned into inventory, staffing, and promo cards.</li>
        </ul>
        <Link className="button secondary" href="/dashboard">
          Skip to dashboard demo
        </Link>
      </section>
    </div>
  );
}
