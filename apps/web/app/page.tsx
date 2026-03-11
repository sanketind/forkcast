import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid gap-6">
      {/* Hero */}
      <section className="hero-card">
        <p className="eyebrow">AI co-pilot for Indian restaurants</p>
        <h2 style={{ fontSize: "2rem", letterSpacing: "-0.02em", marginBottom: "12px" }}>
          Know tomorrow's revenue.<br />Then act on it.
        </h2>
        <p className="lead">
          Forkcast predicts tomorrow's sales using your POS history, local festivals, weather, and
          events — then turns that number into your shopping list, staffing plan, and top dishes to
          push. One WhatsApp message at 7pm, before you sleep.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "24px" }}>
          <Link className="button" href="/sign-in">
            Get started
          </Link>
          <Link className="button ghost" href="/dashboard">
            See demo dashboard
          </Link>
        </div>
      </section>

      {/* The forecast is the engine */}
      <section className="panel">
        <p className="eyebrow">Why prediction comes first</p>
        <h3 style={{ marginBottom: "16px" }}>
          Every decision flows from one number
        </h3>
        <div
          style={{
            display: "grid",
            gap: "2px",
            gridTemplateColumns: "auto 1fr",
            alignItems: "start",
            fontSize: "0.9rem"
          }}
        >
          {[
            ["Revenue forecast →", "Ingredient quantities are calculated from projected dish mix"],
            ["Revenue forecast →", "Staff count and shift hours are scaled to expected covers"],
            ["Revenue forecast →", "Which dishes to promote is based on margin × demand projection"],
            ["Revenue forecast →", "Accuracy is tracked against actuals — the model earns your trust"],
          ].map(([trigger, outcome]) => (
            <div key={trigger} style={{ display: "contents" }}>
              <span style={{ color: "var(--accent)", fontWeight: 700, paddingRight: "16px", paddingBottom: "10px", whiteSpace: "nowrap" }}>
                {trigger}
              </span>
              <span style={{ color: "var(--muted)", paddingBottom: "10px" }}>{outcome}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Two-col: signals + outputs */}
      <section className="grid gap-6 md:grid-cols-2">
        <article className="panel">
          <p className="eyebrow">India-first signals</p>
          <h3>What the engine uses</h3>
          <ul className="stack-list" style={{ marginTop: "14px" }}>
            <li>
              <strong>Your POS history</strong>
              <span>Day-of-week patterns, trend, seasonality</span>
            </li>
            <li>
              <strong>Festival &amp; fasting calendar</strong>
              <span>Navratri, Ekadashi, Eid, Diwali, exam seasons</span>
            </li>
            <li>
              <strong>Live weather forecast</strong>
              <span>Rain drives delivery up; heat shifts drink mix</span>
            </li>
            <li>
              <strong>Local events</strong>
              <span>College fests, cricket matches, road closures</span>
            </li>
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">Daily outputs</p>
          <h3>What you get every evening</h3>
          <ul className="stack-list" style={{ marginTop: "14px" }}>
            <li>
              <strong>Revenue &amp; order forecast</strong>
              <span>₹ prediction with confidence range and reasoning</span>
            </li>
            <li>
              <strong>Ingredient shopping list</strong>
              <span>Exact quantities from recipe + forecast, ready to send your vendor</span>
            </li>
            <li>
              <strong>Peak-hour staffing plan</strong>
              <span>Cooks + floor staff scaled to tomorrow's cover count</span>
            </li>
            <li>
              <strong>Supply early warnings</strong>
              <span>LPG, chicken, onion, oil — 2–7 days before a shortage hits</span>
            </li>
          </ul>
        </article>
      </section>

      {/* Trust / accuracy */}
      <section className="panel">
        <p className="eyebrow">The trust layer</p>
        <h3 style={{ marginBottom: "12px" }}>The model shows its work — and its track record</h3>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", maxWidth: "680px", lineHeight: "1.7" }}>
          Every dashboard shows predicted vs actual revenue for the past 7 days, with an accuracy
          percentage computed from your real POS data. When an owner sees 87% accuracy across two
          weeks, they stop second-guessing the shopping list and start acting on it. That accuracy
          number is the most important metric in the product — it&apos;s what turns a ₹999/month
          experiment into a daily habit.
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
          <Link className="button" href="/sign-in">
            Upload your POS data
          </Link>
          <Link className="button ghost" href="/dashboard">
            View demo
          </Link>
        </div>
      </section>
    </div>
  );
}
