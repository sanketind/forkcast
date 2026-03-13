import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MarketingNav } from "@/components/nav";

async function getAuthState() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

export default async function HomePage() {
  const isAuthed = await getAuthState();

  return (
    <>
      <MarketingNav isAuthed={isAuthed} />

      <main className="landing">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="landing-hero">
          <div className="landing-hero-eyebrow">
            ⚡ AI Co-pilot for Indian Restaurants
          </div>

          <h1 className="landing-hero-h1">
            Know tomorrow.
            <br />
            <strong>Act tonight.</strong>
          </h1>

          <p className="landing-hero-sub">
            Forkcast predicts tomorrow&apos;s revenue, then turns that one number
            into your shopping list, staffing plan, and top dishes to push —
            delivered to WhatsApp at 7pm.
          </p>

          <div className="landing-hero-actions">
            <Link href="/sign-up" className="button button-lg">
              Start free — no card needed
            </Link>
            <Link href="/dashboard" className="button ghost button-lg">
              See live demo →
            </Link>
          </div>

          {/* Mockup card */}
          <div className="hero-mockup">
            <div className="hero-mockup-top">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="hero-mockup-dot" />
                <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Tomorrow · FC Road Kitchen
                </span>
              </div>
              <span className="hero-mockup-time">7:00 PM · Mar 14</span>
            </div>

            <div className="hero-mockup-number">
              ₹<span>24,800</span>
            </div>
            <p className="hero-mockup-label">Forecast revenue · Range ₹22,400 – ₹27,200</p>

            <div className="hero-mockup-chips">
              <span className="pill accent">🍽 187 orders expected</span>
              <span className="pill">📦 Shopping list ready</span>
              <span className="pill">👨‍🍳 3 cooks · 4 floor</span>
              <span className="pill amber">⚠ Onion prices rising</span>
            </div>

            {/* Mini sparkline bars */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginTop: 24, height: 48 }}>
              {[60, 75, 55, 80, 70, 85, 90, 100].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    borderRadius: "3px 3px 0 0",
                    background: i === 7
                      ? "var(--teal)"
                      : "var(--surface-high)",
                    opacity: i === 7 ? 1 : 0.6
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: "0.65rem", color: "var(--text-tertiary)" }}>7 days ago</span>
              <span style={{ fontSize: "0.65rem", color: "var(--teal)", fontWeight: 700 }}>Tomorrow ↑</span>
            </div>
          </div>
        </section>

        {/* ── Signal marquee ─────────────────────────────────────── */}
        <div className="marquee-section">
          <div className="marquee-track">
            {[
              "POS History Analysis",
              "Navratri Fasting Calendar",
              "Live Weather Forecast",
              "Mandi Onion Prices",
              "Cricket Match Schedule",
              "Ekadashi Fasting Days",
              "Diwali Season Demand",
              "Local College Events",
              "Rain & Delivery Surge",
              "Chicken Price Signals",
              "Exam Season Drop",
              "LPG Supply Watch",
              "POS History Analysis",
              "Navratri Fasting Calendar",
              "Live Weather Forecast",
              "Mandi Onion Prices",
              "Cricket Match Schedule",
              "Ekadashi Fasting Days",
              "Diwali Season Demand",
              "Local College Events",
              "Rain & Delivery Surge",
              "Chicken Price Signals",
              "Exam Season Drop",
              "LPG Supply Watch",
            ].map((item, i) => (
              <div key={i} className="marquee-item">
                <div className="marquee-dot" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── How it works ───────────────────────────────────────── */}
        <section className="landing-section" id="how-it-works">
          <div className="landing-section-header">
            <div className="eyebrow">How it works</div>
            <h2>Three steps to never guessing again</h2>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Connect your POS</h3>
              <p>
                Upload your weekly CSV export from Petpooja, UrbanPiper, or
                Posist. Forkcast auto-detects the format and maps your sales
                history in minutes.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Engine reads India</h3>
              <p>
                Your POS patterns are combined with festivals, fasting days,
                weather, mandi prices, local events, and day-of-week
                seasonality — signals most tools ignore.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>7pm. Your number arrives.</h3>
              <p>
                Every evening, Forkcast sends a WhatsApp message: tomorrow&apos;s
                predicted revenue, shopping list quantities, staffing plan,
                and supply warnings — ready to act on before you sleep.
              </p>
            </div>
          </div>
        </section>

        {/* ── Feature grid ───────────────────────────────────────── */}
        <section className="landing-section" id="features" style={{ paddingTop: 0 }}>
          <div className="landing-section-header">
            <div className="eyebrow">What you get</div>
            <h2>Every decision flows from one number</h2>
          </div>
          <div className="feature-bento">
            {/* Large featured card */}
            <div className="feature-card large">
              <div className="feature-card-icon" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                📈
              </div>
              <h3>Revenue Forecast</h3>
              <p>
                Tomorrow&apos;s predicted revenue with a confidence range, computed
                from your real POS history. The model explains its reasoning —
                festival uplift, rain effect, last-week comparison — so you
                understand every number.
              </p>
              <div style={{ marginTop: "auto", paddingTop: 28 }}>
                <div style={{ background: "var(--surface-raised)", borderRadius: 12, padding: "20px 20px 0", overflow: "hidden" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Tomorrow</div>
                  <div style={{ fontSize: "2.4rem", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text)" }}>
                    ₹24,800 <span style={{ fontSize: "1rem", color: "var(--teal)", fontWeight: 600 }}>↑12%</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 16 }}>vs ₹22,100 last Friday</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 52 }}>
                    {[45, 60, 52, 70, 65, 80, 76, 88].map((h, i) => (
                      <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "2px 2px 0 0", background: i === 7 ? "var(--teal)" : "var(--surface-high)", opacity: i === 7 ? 1 : 0.5 }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right col: 4 small cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="feature-card" style={{ flex: 1 }}>
                <div className="feature-card-icon" style={{ width: 36, height: 36, fontSize: 16, background: "var(--indigo-soft)", color: "var(--indigo)", borderRadius: 10, marginBottom: 14 }}>🛒</div>
                <h3 style={{ fontSize: "var(--text-base)", marginBottom: 6 }}>Ingredient Shopping List</h3>
                <p>Exact quantities per ingredient, derived from your recipe cards and tomorrow&apos;s dish mix. Ready to send your sabzi vendor.</p>
              </div>
              <div className="feature-card" style={{ flex: 1 }}>
                <div className="feature-card-icon" style={{ width: 36, height: 36, fontSize: 16, background: "var(--amber-soft)", color: "var(--amber)", borderRadius: 10, marginBottom: 14 }}>👨‍🍳</div>
                <h3 style={{ fontSize: "var(--text-base)", marginBottom: 6 }}>Peak-Hour Staffing Plan</h3>
                <p>Cooks and floor staff scaled to cover count. Shift start/end times derived from your hourly order pattern.</p>
              </div>
              <div className="feature-card" style={{ flex: 1 }}>
                <div className="feature-card-icon" style={{ width: 36, height: 36, fontSize: 16, background: "var(--red-soft)", color: "var(--red)", borderRadius: 10, marginBottom: 14 }}>⚠️</div>
                <h3 style={{ fontSize: "var(--text-base)", marginBottom: 6 }}>Supply Early Warnings</h3>
                <p>LPG, chicken, onion, oil — 2–7 days before a shortage hits your margin. Sourced from mandi prices and news signals.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── India-first section ────────────────────────────────── */}
        <div className="india-section" id="india-signals">
          <div className="india-section-inner">
            <div>
              <div className="eyebrow">India-first signals</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", letterSpacing: "-0.03em", marginTop: 12, marginBottom: 16, color: "var(--text)" }}>
                Built for India&apos;s restaurant reality
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-base)", lineHeight: 1.7, maxWidth: 460 }}>
                Generic forecasting tools don&apos;t know that Navratri cuts vegetarian
                demand by 40%, or that a cricket final drives delivery orders
                by 2×. Forkcast was built for the Indian calendar.
              </p>
            </div>
            <ul className="india-signals-list">
              {[
                { icon: "📅", label: "Festival & Fasting Calendar", desc: "Navratri, Ekadashi, Eid, Diwali, Holi — each with demand impact models" },
                { icon: "🌧", label: "Live Weather Forecast", desc: "Rain drives delivery up; extreme heat shifts the drink mix" },
                { icon: "🏏", label: "Local Events", desc: "Cricket matches, college fests, road closures, IPL finals" },
                { icon: "💰", label: "Mandi Price Signals", desc: "AgMarknet onion, potato, tomato, chicken prices — 7-day ahead" },
                { icon: "📰", label: "Supply News", desc: "LPG shortage news, transport strikes, seasonal scarcity alerts" },
                { icon: "📊", label: "Your POS History", desc: "Day-of-week, trend, holiday-adj seasonality from your own data" },
              ].map((s) => (
                <li key={s.label} className="india-signal-item">
                  <div className="india-signal-icon">{s.icon}</div>
                  <div>
                    <strong>{s.label}</strong>
                    <span>{s.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Accuracy section ───────────────────────────────────── */}
        <section className="accuracy-strip" id="accuracy">
          <div className="eyebrow" style={{ textAlign: "center", marginBottom: 16 }}>Trust layer</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.03em", color: "var(--text)", maxWidth: 600, margin: "0 auto 16px" }}>
            The model shows its work — and its track record
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto", fontSize: "var(--text-base)", lineHeight: 1.7 }}>
            Every dashboard shows predicted vs actual revenue for the past 7 days.
            When owners see 87% accuracy over two weeks, they stop second-guessing
            the shopping list and start acting on it.
          </p>
          <div className="accuracy-stat-row">
            <div className="accuracy-stat">
              <div className="accuracy-stat-value accent">87%</div>
              <div className="accuracy-stat-label">average accuracy</div>
            </div>
            <div className="accuracy-stat">
              <div className="accuracy-stat-value">7pm</div>
              <div className="accuracy-stat-label">daily delivery time</div>
            </div>
            <div className="accuracy-stat">
              <div className="accuracy-stat-value">6</div>
              <div className="accuracy-stat-label">India-specific signals</div>
            </div>
            <div className="accuracy-stat">
              <div className="accuracy-stat-value">3</div>
              <div className="accuracy-stat-label">POS formats supported</div>
            </div>
          </div>

          {/* Sample accuracy table */}
          <div className="accuracy-sample-table">
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Predicted</th>
                  <th>Actual</th>
                  <th>Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Monday", "₹18,400", "₹18,900", "97%", "good"],
                  ["Tuesday", "₹16,200", "₹17,100", "94%", "good"],
                  ["Wednesday", "₹22,800", "₹21,400", "93%", "good"],
                  ["Thursday", "₹19,600", "₹18,200", "92%", "good"],
                  ["Friday", "₹24,100", "₹22,800", "94%", "good"],
                ].map(([day, pred, act, acc, cls]) => (
                  <tr key={day}>
                    <td style={{ fontWeight: 500 }}>{day}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{pred}</td>
                    <td>{act}</td>
                    <td>
                      <span className={`accuracy-badge ${cls}`}>{acc}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── CTA section ────────────────────────────────────────── */}
        <div className="landing-cta">
          <div className="landing-cta-inner">
            <div style={{ display: "inline-block", marginBottom: 20, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>Ready to start?</div>
            <h2>Your 7pm forecast is waiting.</h2>
            <p>Upload your POS CSV and get your first forecast in under 5 minutes.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/sign-up" className="button button-lg">
                Start free — no card needed
              </Link>
              <Link href="/dashboard" className="button button-lg" style={{ background: "rgba(255,255,255,0.18)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.35)" }}>
                Explore demo first
              </Link>
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="landing-footer">
          <div className="landing-footer-inner">
            <Link href="/" className="marketing-logo">
              <div className="logo-icon" style={{ width: 24, height: 24, fontSize: 13 }}>⚡</div>
              <span className="logo-text" style={{ fontSize: "0.9rem" }}>Forkcast</span>
            </Link>
            <div className="landing-footer-links">
              <Link href="/#how-it-works">How it works</Link>
              <Link href="/#features">Features</Link>
              <Link href="/#accuracy">Accuracy</Link>
              <Link href="/sign-in">Sign in</Link>
              <Link href="/sign-up">Get started</Link>
            </div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
              Made for India 🇮🇳 · {new Date().getFullYear()}
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}
