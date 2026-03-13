import { getOutletProfile } from "@/lib/demo-state";
import { saveSettingsAction } from "./actions";

const INDIA_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const CUISINE_TYPES = [
  "North Indian", "South Indian", "Pan-Indian", "Mughlai",
  "Chinese", "Indo-Chinese", "Continental", "Italian",
  "Bengali", "Gujarati", "Rajasthani", "Punjabi",
  "Maharashtrian", "Andhra", "Kerala", "Fast Food",
  "Bakery & Café", "Multi-cuisine"
];

export default async function SettingsPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [profile, params] = await Promise.all([
    getOutletProfile(),
    searchParams
  ]);

  const saved = params.saved === "1";

  return (
    <div className="grid gap-6" style={{ maxWidth: 720 }}>
      {/* Header */}
      <div style={{ marginBottom: 8 }}>
        <p className="eyebrow">Configuration</p>
        <h2 style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.03em", marginBottom: 8, color: "var(--text)" }}>Outlet settings</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-base)", maxWidth: 560 }}>
          Update your outlet profile. Changes affect forecast signals, supply alerts, and
          WhatsApp notifications immediately.
        </p>
      </div>

      {/* Success banner */}
      {saved && (
        <div
          style={{
            padding: "12px 18px",
            borderRadius: 8,
            background: "var(--teal-soft)",
            border: "1px solid rgba(0,166,153,0.25)",
            color: "var(--teal)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          ✓ Settings saved successfully.
        </div>
      )}

      {/* Form */}
      <section className="panel">
        <p className="eyebrow">Outlet details</p>
        <h3 style={{ marginBottom: "24px" }}>Basic info</h3>

        <form action={saveSettingsAction} className="grid gap-5">
          {/* Name */}
          <label className="field">
            <span>Outlet name</span>
            <input
              className="text-input"
              name="outletName"
              defaultValue={profile.outletName}
              required
              maxLength={160}
              placeholder="e.g. Koramangala Grill"
            />
          </label>

          {/* City + State */}
          <div className="form-grid">
            <label className="field">
              <span>City</span>
              <input
                className="text-input"
                name="city"
                defaultValue={profile.city}
                required
                maxLength={120}
                placeholder="e.g. Bengaluru"
              />
            </label>

            <label className="field">
              <span>State</span>
              <select
                className="text-input"
                name="state"
                defaultValue={profile.state}
                style={{ cursor: "pointer" }}
              >
                {INDIA_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Cuisine + Seats */}
          <div className="form-grid">
            <label className="field">
              <span>Cuisine type</span>
              <select
                className="text-input"
                name="cuisine"
                defaultValue={profile.cuisine}
                style={{ cursor: "pointer" }}
              >
                {CUISINE_TYPES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Seating capacity</span>
              <input
                className="text-input"
                name="seats"
                type="number"
                min={1}
                max={2000}
                defaultValue={profile.seats}
                required
              />
            </label>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }} />

          {/* WhatsApp section */}
          <div>
            <p className="eyebrow" style={{ marginBottom: "6px" }}>Notifications</p>
            <h3 style={{ marginBottom: "16px" }}>WhatsApp alerts</h3>

            <label className="field">
              <span>WhatsApp number</span>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-secondary)",
                    fontSize: "var(--text-sm)",
                    pointerEvents: "none"
                  }}
                >
                  +91
                </span>
                <input
                  className="text-input"
                  name="whatsappNumber"
                  type="tel"
                  defaultValue={
                    profile.whatsappNumber?.replace(/^\+91/, "").replace(/^91/, "") ?? ""
                  }
                  placeholder="9876543210"
                  maxLength={20}
                  style={{ paddingLeft: "44px" }}
                />
              </div>
              <span style={{ fontSize: "var(--text-xs)" }}>
                Receives daily 7pm briefing + critical supply alerts via Twilio WhatsApp.{" "}
                <a
                  href="https://www.twilio.com/en-us/messaging/channels/whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent)" }}
                >
                  Set up Twilio →
                </a>
              </span>
            </label>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "8px" }}>
            <button className="button" type="submit" style={{ minWidth: "140px" }}>
              Save changes
            </button>
            <a href="/dashboard" className="button ghost">
              Back to dashboard
            </a>
            {profile.outletId ? (
              <small style={{ marginLeft: "auto", color: "var(--text-tertiary)" }}>
                Outlet ID #{profile.outletId} · connected to database
              </small>
            ) : (
              <small style={{ marginLeft: "auto", color: "var(--amber)" }}>
                Demo mode — settings saved to session only.{" "}
                <a href="/onboarding" className="accent-link">
                  Upload POS data →
                </a>
              </small>
            )}
          </div>
        </form>
      </section>

      {/* Danger zone */}
      <section className="panel" style={{ borderColor: "rgba(193,53,21,0.25)" }}>
        <p className="eyebrow" style={{ color: "var(--red)" }}>Danger zone</p>
        <h3 style={{ marginBottom: "12px" }}>Reset session</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: "16px" }}>
          Clears your outlet profile cookie and returns to demo mode. Your uploaded POS data is
          preserved in the database.
        </p>
        <a href="/api/auth/sign-out" className="button ghost button-sm">
          Sign out / reset session
        </a>
      </section>
    </div>
  );
}
