import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MarketingNav } from "@/components/nav";
import { ForkcastIcon } from "@/components/logo";

async function getAuthState() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="landing-hero">
          <div className="landing-hero-eyebrow">
            <ForkcastIcon size={11} color="var(--accent)" /> AI Co-pilot for Indian Restaurants
          </div>

          <h1 className="landing-hero-h1">
            Will tomorrow
            <br />
            <strong>be profitable?</strong>
          </h1>

          <p className="landing-hero-sub">
            The daily profit co-pilot for Indian restaurant owners —
            delivered to WhatsApp at 7pm.
          </p>

          <div className="hero-benefit-chips">
            <span className="hero-benefit-chip">⚖️ Revenue vs break-even</span>
            <span className="hero-benefit-chip">🛒 Shopping list</span>
            <span className="hero-benefit-chip">👨‍🍳 Staffing plan</span>
            <span className="hero-benefit-chip">⚠️ Supply watch</span>
          </div>

          <div className="landing-hero-actions">
            <Link href="/sign-up" className="button button-lg">
              Start free — no card needed
            </Link>
            <Link href="/dashboard" className="button ghost button-lg">
              See live demo →
            </Link>
          </div>

          {/* Daily briefing mockup */}
          <div className="hero-mockup">
            <div className="hero-mockup-top">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="hero-mockup-dot" />
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-secondary)",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Daily Brief · FC Road Kitchen
                </span>
              </div>
              <span className="hero-mockup-time">7:00 PM · Mar 14</span>
            </div>

            <div className="hero-mockup-forecast-row">
              <div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 4,
                  }}
                >
                  Tomorrow&apos;s Forecast
                </div>
                <div className="hero-mockup-number">
                  ₹<span>24,800</span>
                </div>
                <p className="hero-mockup-label">Range ₹22,400 – ₹27,200</p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 4,
                  height: 52,
                  flex: "0 0 120px",
                }}
              >
                {[45, 60, 52, 70, 65, 80, 76, 88].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      borderRadius: "2px 2px 0 0",
                      background:
                        i === 7 ? "var(--teal)" : "var(--surface-high)",
                      opacity: i === 7 ? 1 : 0.6,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Break-even check — the centrepiece */}
            <div className="hero-mockup-breakeven">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="breakeven-check-icon">✓</span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--teal)",
                  }}
                >
                  Break-even cleared
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginTop: 6,
                }}
              >
                Forecast ₹24,800 › Break-even ₹15,878 — Profit contribution:{" "}
                <strong style={{ color: "var(--teal)" }}>₹8,922</strong>
              </div>
            </div>

            <div className="hero-mockup-chips">
              <span className="pill teal">🍽 187 orders expected</span>
              <span className="pill">📦 Shopping list ready</span>
              <span className="pill">👨‍🍳 3 cooks · 4 floor</span>
              <span className="pill amber">⚠ Onion prices +12%</span>
            </div>
          </div>
        </section>

        {/* ── PROBLEM BAR ───────────────────────────────────────────── */}
        <section className="problem-section">
          <div className="problem-section-inner">
            <div className="problem-headline-block">
              <div className="eyebrow" style={{ color: "var(--accent)" }}>
                The real problem
              </div>
              <h2 className="problem-headline">
                60–70% of Indian restaurants
                <br />
                close in year one.
              </h2>
              <p className="problem-sub">
                The food is rarely the problem. The numbers are. Most owners
                don&apos;t know their break-even, price dishes by feel, and
                discover a bad month when the cash runs out.
              </p>
            </div>
            <div className="problem-cards">
              <div className="problem-card">
                <div className="problem-card-icon problem-card-red">💸</div>
                <div>
                  <h3>Financial Blindness</h3>
                  <p>
                    No break-even awareness. Food cost climbs from 30% to 48%
                    over weeks. The owner notices at month-end — when
                    the money&apos;s already gone.
                  </p>
                </div>
              </div>
              <div className="problem-card">
                <div className="problem-card-icon problem-card-amber">🎲</div>
                <div>
                  <h3>Demand Guessing</h3>
                  <p>
                    Ordering by memory causes 20–30% food waste. No one
                    connects Shravan fasting to tomorrow&apos;s prep list.
                    ₹18,000 of chicken, wasted.
                  </p>
                </div>
              </div>
              <div className="problem-card">
                <div className="problem-card-icon problem-card-teal">📦</div>
                <div>
                  <h3>Supply Blindness</h3>
                  <p>
                    LPG runs out, onion prices triple, cooking oil doubles. No
                    warning, no buffer plan. The restaurant that was profitable
                    on paper closes for three days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SIGNAL MARQUEE ────────────────────────────────────────── */}
        <div className="marquee-section">
          <div className="marquee-track">
            {[
              "📅 Navratri Fasting Calendar",
              "🌧 Live Weather Forecast",
              "💰 Agmarknet Mandi Prices",
              "🏏 IPL Match Schedule",
              "🕯 Ekadashi Fasting Days",
              "📊 POS Sales History",
              "🎆 Diwali Season Demand",
              "🎓 College Exam Season",
              "📰 LPG Supply Watch",
              "🍗 Chicken Price Signal",
              "💼 Salary Week Boost",
              "📍 Location Type Model",
              "📅 Navratri Fasting Calendar",
              "🌧 Live Weather Forecast",
              "💰 Agmarknet Mandi Prices",
              "🏏 IPL Match Schedule",
              "🕯 Ekadashi Fasting Days",
              "📊 POS Sales History",
              "🎆 Diwali Season Demand",
              "🎓 College Exam Season",
              "📰 LPG Supply Watch",
              "🍗 Chicken Price Signal",
              "💼 Salary Week Boost",
              "📍 Location Type Model",
            ].map((item, i) => (
              <div key={i} className="marquee-item">
                <div className="marquee-dot" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
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
                Upload your weekly CSV from Petpooja, UrbanPiper, or Posist.
                Auto-detection maps your sales history in minutes — no manual
                field mapping, no IT help needed.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Engine reads India</h3>
              <p>
                Your POS patterns combine with 8 India-first signals — fasting
                calendars, mandi prices, weather, cricket, salary cycles —
                weighted for your specific cuisine type and location.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>7pm. Your brief arrives.</h3>
              <p>
                Tomorrow&apos;s revenue vs break-even, shopping list, staffing
                plan, and supply warnings — on WhatsApp at 7pm so you can act
                before you sleep.
              </p>
            </div>
          </div>
        </section>

        {/* ── FEATURES (6-card bento) ───────────────────────────────── */}
        <section
          className="landing-section"
          id="features"
          style={{ paddingTop: 0 }}
        >
          <div className="landing-section-header">
            <div className="eyebrow">What you get</div>
            <h2>Every decision flows from one forecast</h2>
            <p className="landing-section-desc">
              Six panels that connect your revenue forecast to every daily
              decision — from what to buy this morning to which dishes are
              silently killing your margin.
            </p>
          </div>

          <div className="feature-bento-v2">
            {/* Revenue Forecast — tall left */}
            <div className="feature-card-v2 feature-card-v2-tall accent-top">
              <div
                className="feature-card-v2-icon"
                style={{
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                📈
              </div>
              <h3>Revenue Forecast</h3>
              <p>
                Tomorrow&apos;s predicted revenue with confidence range. The
                model explains its reasoning — festival uplift, rain effect,
                salary week — so you understand every number.
              </p>
              <div className="feature-mini-demo">
                <div className="feature-mini-demo-label">Tomorrow · Friday</div>
                <div className="feature-mini-demo-number">
                  ₹24,800{" "}
                  <span style={{ fontSize: "0.9rem", color: "var(--teal)" }}>
                    ↑12%
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    marginBottom: 10,
                  }}
                >
                  vs ₹22,100 last Friday
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-tertiary)",
                    marginBottom: 10,
                  }}
                >
                  Salary week +8% · Weekend +12% · Rain −4%
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 3,
                    height: 36,
                  }}
                >
                  {[45, 60, 52, 70, 65, 80, 76, 88].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${h}%`,
                        borderRadius: "2px 2px 0 0",
                        background:
                          i === 7 ? "var(--teal)" : "var(--surface-high)",
                        opacity: i === 7 ? 1 : 0.5,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Break-even check — tall right */}
            <div className="feature-card-v2 feature-card-v2-tall teal-top">
              <div
                className="feature-card-v2-icon"
                style={{
                  background: "var(--teal-soft)",
                  color: "var(--teal)",
                }}
              >
                ⚖️
              </div>
              <h3>Break-even Check</h3>
              <p>
                Enter your fixed costs once. Every morning you see: "Forecast
                ₹24,800 › Break-even ₹15,878. Profit contribution ₹8,922."
                Every month: the day you hit break-even.
              </p>
              <div className="feature-mini-demo">
                <div className="breakeven-demo-row">
                  <span>Forecast revenue</span>
                  <span
                    style={{ fontWeight: 700, color: "var(--text)" }}
                  >
                    ₹24,800
                  </span>
                </div>
                <div className="breakeven-demo-row">
                  <span>Break-even</span>
                  <span
                    style={{ fontWeight: 700, color: "var(--text)" }}
                  >
                    ₹15,878
                  </span>
                </div>
                <div
                  style={{
                    height: 1,
                    background: "var(--border)",
                    margin: "10px 0",
                  }}
                />
                <div className="breakeven-demo-row">
                  <span style={{ color: "var(--teal)", fontWeight: 600 }}>
                    ✓ Profit contribution
                  </span>
                  <span style={{ fontWeight: 700, color: "var(--teal)" }}>
                    ₹8,922
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontSize: "0.72rem",
                    color: "var(--text-tertiary)",
                  }}
                >
                  Break-even day:{" "}
                  <strong style={{ color: "var(--text)" }}>Day 14</strong> ·
                  Last month: Day 19 →{" "}
                  <span style={{ color: "var(--teal)" }}>improving</span>
                </div>
              </div>
            </div>

            {/* Shopping list */}
            <div className="feature-card-v2">
              <div
                className="feature-card-v2-icon"
                style={{
                  background: "var(--indigo-soft)",
                  color: "var(--indigo)",
                }}
              >
                🛒
              </div>
              <h3>Ingredient Shopping List</h3>
              <p>
                Exact quantities per ingredient, from your recipe cards and
                tomorrow&apos;s forecast dish mix. Ready to forward to your
                sabzi vendor.
              </p>
            </div>

            {/* Staffing plan */}
            <div className="feature-card-v2">
              <div
                className="feature-card-v2-icon"
                style={{
                  background: "var(--amber-soft)",
                  color: "var(--amber)",
                }}
              >
                👨‍🍳
              </div>
              <h3>Peak-Hour Staffing Plan</h3>
              <p>
                Cooks and floor staff scaled to cover count. Shift hours derived
                from your actual hourly order pattern — not a guess.
              </p>
            </div>

            {/* Menu engineering */}
            <div className="feature-card-v2">
              <div
                className="feature-card-v2-icon"
                style={{
                  background: "rgba(123,97,255,0.09)",
                  color: "#7B61FF",
                }}
              >
                ⭐
              </div>
              <h3>Menu Engineering</h3>
              <p>
                Star, Plow Horse, Puzzle, Dog — every dish classified by margin
                × orders. &ldquo;Butter Chicken is a Plow Horse. Reprice ₹20 or
                reduce portion cost.&rdquo;
              </p>
            </div>

            {/* Supply watch */}
            <div className="feature-card-v2">
              <div
                className="feature-card-v2-icon"
                style={{ background: "var(--red-soft)", color: "var(--red)" }}
              >
                ⚠️
              </div>
              <h3>Supply Early Warnings</h3>
              <p>
                LPG, chicken, onion, oil — 2–7 days before a shortage hits your
                margin. Sourced from mandi prices and news signals, scanned
                every 6 hours.
              </p>
            </div>
          </div>
        </section>

        {/* ── INDIA-FIRST SIGNALS ───────────────────────────────────── */}
        <div className="india-section" id="india-signals">
          <div className="india-section-inner">
            <div>
              <div className="eyebrow">India-first intelligence</div>
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
                  letterSpacing: "-0.03em",
                  marginTop: 12,
                  marginBottom: 16,
                  color: "var(--text)",
                }}
              >
                The signals every
                <br />
                Western tool ignores
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "var(--text-base)",
                  lineHeight: 1.7,
                  maxWidth: 400,
                  marginBottom: 24,
                }}
              >
                Navratri cuts non-veg demand by 40%. A cricket final drives
                delivery 2×. Shravan month can halve a biryani
                restaurant&apos;s revenue for 30 days. Forkcast knows all of
                this — and adjusts for your cuisine type.
              </p>

              {/* Signal impact mini-table */}
              <div className="india-signal-table">
                <div className="india-signal-table-row header">
                  <span>Event</span>
                  <span>Non-veg</span>
                  <span>Pure veg</span>
                </div>
                {[
                  ["Shravan month", "−50%", "+40%"],
                  ["Navratri (×2/yr)", "−40%", "+50%"],
                  ["Eid ul-Fitr", "+200%", "—"],
                  ["New Year&apos;s Eve", "+150%", "+30%"],
                  ["Ekadashi", "−25%", "+35%"],
                ].map(([ev, nv, pv]) => (
                  <div key={ev} className="india-signal-table-row">
                    <span dangerouslySetInnerHTML={{ __html: ev }} />
                    <span
                      style={{
                        color: nv.startsWith("+")
                          ? "var(--teal)"
                          : "var(--red)",
                        fontWeight: 600,
                      }}
                    >
                      {nv}
                    </span>
                    <span
                      style={{
                        color:
                          pv === "—"
                            ? "var(--text-tertiary)"
                            : pv.startsWith("+")
                            ? "var(--teal)"
                            : "var(--red)",
                        fontWeight: 600,
                      }}
                    >
                      {pv}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ul className="india-signals-list">
              {[
                {
                  icon: "📅",
                  label: "Festival & Fasting Calendar",
                  desc: "Shravan, Navratri, Ekadashi, Eid, Diwali — cuisine-specific demand models for each",
                },
                {
                  icon: "🌧",
                  label: "Live Weather Forecast",
                  desc: "Rain drives delivery up; extreme heat shifts drink mix; monsoon cuts footfall",
                },
                {
                  icon: "🏏",
                  label: "Cricket & Local Events",
                  desc: "IPL match nights, college fests, road closures — 60+ trigger nights per season",
                },
                {
                  icon: "💰",
                  label: "Mandi Price Signals",
                  desc: "Agmarknet onion, tomato, chicken, paneer — 7-day price trend for smarter ordering",
                },
                {
                  icon: "📰",
                  label: "Supply Disruption News",
                  desc: "LPG shortage, transport strikes, seasonal scarcity — NewsAPI scanned every 6 hours",
                },
                {
                  icon: "💼",
                  label: "Salary & Academic Calendar",
                  desc: "1st–5th salary boost, 25th–31st conservative, exam season student area drop",
                },
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

        {/* ── DAY IN THE LIFE ───────────────────────────────────────── */}
        <section className="daylife-section" id="day-in-the-life">
          <div className="daylife-inner">
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div className="eyebrow">Day in the life</div>
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                  letterSpacing: "-0.03em",
                  marginTop: 12,
                  color: "var(--text)",
                }}
              >
                Aarav runs a 40-seat restaurant on FC Road, Pune.
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  maxWidth: 520,
                  margin: "12px auto 0",
                  lineHeight: 1.7,
                  fontSize: "var(--text-base)",
                }}
              >
                Monthly revenue ₹12L. Running 2 years. Same week repeating,
                every week.
              </p>
            </div>

            <div className="daylife-grid">
              <div className="daylife-col daylife-col-before">
                <div className="daylife-col-header">
                  <span className="daylife-badge before">
                    Without Forkcast
                  </span>
                </div>
                <div className="daylife-timeline">
                  {[
                    {
                      time: "7:00am",
                      icon: "📞",
                      text: "Calls vendor. Orders \u201csame as last week.\u201d Doesn\u2019t know Shravan starts in 4 days. Non-veg orders will drop 45%.",
                    },
                    {
                      time: "8:30am",
                      icon: "👥",
                      text: "Calls 6 kitchen staff. Doesn't know it's going to be a slow Monday. Pays ₹3,200 in wages for a day that earns ₹8,000.",
                    },
                    {
                      time: "12:00pm",
                      icon: "🍗",
                      text: "Quieter lunch than expected. Chicken sitting in the fridge. Not sure if it'll last till tomorrow.",
                    },
                    {
                      time: "6:00pm",
                      icon: "🛢",
                      text: "Cook calls: out of cooking oil. Emergency purchase at ₹180/litre vs usual ₹130. ₹2,000 extra on an already slow day.",
                    },
                    {
                      time: "10:30pm",
                      icon: "💰",
                      text: "Counts the till. ₹9,200. \u201cDecent day.\u201d Break-even is ₹12,400. Today was a loss day. He doesn\u2019t know.",
                    },
                    {
                      time: "Month end",
                      icon: "😔",
                      text: "Revenue ₹12L. Food cost 41%. Labour 33%. Net profit ₹96,000. Pays himself ₹60,000. Actual business profit: ₹36,000. He doesn't know this number.",
                      highlight: "bad",
                    },
                  ].map((item) => (
                    <div
                      key={item.time}
                      className={`daylife-item${item.highlight === "bad" ? " highlight-bad" : ""}`}
                    >
                      <div className="daylife-time">{item.time}</div>
                      <div className="daylife-icon">{item.icon}</div>
                      <div className="daylife-text">{item.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="daylife-col daylife-col-after">
                <div className="daylife-col-header">
                  <span className="daylife-badge after">With Forkcast</span>
                </div>
                <div className="daylife-timeline">
                  {[
                    {
                      time: "7:00pm (prev)",
                      icon: "⚡",
                      text: "Daily brief arrives: \"Tomorrow \u20b916,800 (\u221244% \u2014 Shravan in 4 days, Monday fasting). Break-even \u20b912,400 \u2705. Skip extra chicken. Add paneer +2kg. 4 staff (not 6).\"",
                    },
                    {
                      time: "7:00am",
                      icon: "✅",
                      text: "Orders accordingly. 4 staff. Less chicken. Extra paneer. No emergency oil run — buffer stock from the supply warning 3 days ago.",
                    },
                    {
                      time: "10:30pm",
                      icon: "📊",
                      text: "₹15,400 actual (forecast ₹16,800 → 92% accuracy). Profit contribution: ₹3,000 above break-even. Checked in 10 seconds on the dashboard.",
                    },
                    {
                      time: "Month end",
                      icon: "🎉",
                      text: "Food cost: 33% — Forkcast flagged it twice at 37%, he adjusted ordering both times. Net profit: ₹1,44,000. Knows which 3 dishes to reprice next month.",
                      highlight: "good",
                    },
                  ].map((item) => (
                    <div
                      key={item.time}
                      className={`daylife-item${item.highlight === "good" ? " highlight-good" : ""}`}
                    >
                      <div className="daylife-time">{item.time}</div>
                      <div className="daylife-icon">{item.icon}</div>
                      <div className="daylife-text">{item.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ───────────────────────────────────────────────── */}
        <section className="pricing-section" id="pricing">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="eyebrow">Pricing</div>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                letterSpacing: "-0.03em",
                marginTop: 12,
                color: "var(--text)",
              }}
            >
              Pays for itself the first week
              <br />
              it catches a food cost problem.
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                maxWidth: 520,
                margin: "12px auto 0",
                lineHeight: 1.7,
                fontSize: "var(--text-base)",
              }}
            >
              A Growth plan restaurant that catches food cost creeping 32% →
              40% and corrects it saves ₹64,000/month on ₹8L revenue. The plan
              costs ₹2,499.
            </p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-plan-name">Starter</div>
              <div className="pricing-price">
                ₹999<span>/month</span>
              </div>
              <div className="pricing-target">
                New restaurants · Cloud kitchens
              </div>
              <ul className="pricing-features">
                <li>Revenue forecast + confidence range</li>
                <li>Break-even calculator</li>
                <li>Daily ingredient shopping list</li>
                <li>Staffing plan (cooks + floor)</li>
                <li>WhatsApp daily brief at 7pm</li>
                <li>Petpooja / UrbanPiper / Posist import</li>
              </ul>
              <Link
                href="/sign-up"
                className="button button-lg"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Start free
              </Link>
            </div>

            <div className="pricing-card pricing-card-featured">
              <div className="pricing-badge-popular">Most popular</div>
              <div className="pricing-plan-name">Growth</div>
              <div className="pricing-price">
                ₹2,499<span>/month</span>
              </div>
              <div className="pricing-target">
                Established QSR · Casual dining
              </div>
              <ul className="pricing-features">
                <li>Everything in Starter</li>
                <li>Food cost % tracking (real-time)</li>
                <li>Weekly P&amp;L panel</li>
                <li>Menu engineering (Star / Plow Horse)</li>
                <li>Supply Watch alerts</li>
                <li>Forecast accuracy tracker</li>
              </ul>
              <Link
                href="/sign-up"
                className="button button-lg pricing-cta-featured"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Start free
              </Link>
            </div>

            <div className="pricing-card">
              <div className="pricing-plan-name">Pro</div>
              <div className="pricing-price">
                ₹5,999<span>/month</span>
              </div>
              <div className="pricing-target">
                Multi-outlet chains · Up to 5 outlets
              </div>
              <ul className="pricing-features">
                <li>Everything in Growth</li>
                <li>Multi-outlet dashboard</li>
                <li>Consolidated P&amp;L view</li>
                <li>Cross-outlet benchmarking</li>
                <li>API access</li>
                <li>Priority support</li>
              </ul>
              <Link
                href="/sign-up"
                className="button button-lg"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Get started
              </Link>
            </div>
          </div>

          <p className="pricing-footnote">
            All plans include a 14-day free trial · No credit card required ·
            Cancel anytime
          </p>
        </section>

        {/* ── ACCURACY / TRUST LAYER ───────────────────────────────── */}
        <div className="accuracy-outer">
          <section className="accuracy-strip" id="accuracy">
            <div className="eyebrow" style={{ textAlign: "center", marginBottom: 16 }}>
              Trust layer
            </div>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                letterSpacing: "-0.03em",
                color: "var(--text)",
                maxWidth: 600,
                margin: "0 auto 16px",
              }}
            >
              The model shows its work — and its track record
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                maxWidth: 520,
                margin: "0 auto",
                fontSize: "var(--text-base)",
                lineHeight: 1.7,
              }}
            >
              Every dashboard shows predicted vs actual for the past 7 days.
              When owners see 87% accuracy over two weeks, they stop
              second-guessing the shopping list and start acting on it.
            </p>
            <div className="accuracy-stat-row">
              <div className="accuracy-stat">
                <div className="accuracy-stat-value accent">87%</div>
                <div className="accuracy-stat-label">average accuracy</div>
              </div>
              <div className="accuracy-stat">
                <div className="accuracy-stat-value teal">&gt;85%</div>
                <div className="accuracy-stat-label">at 14+ days history</div>
              </div>
              <div className="accuracy-stat">
                <div className="accuracy-stat-value">7pm</div>
                <div className="accuracy-stat-label">daily delivery time</div>
              </div>
              <div className="accuracy-stat">
                <div className="accuracy-stat-value">8</div>
                <div className="accuracy-stat-label">India-specific signals</div>
              </div>
            </div>

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
        </div>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <div className="landing-cta">
          <div className="landing-cta-inner">
            <div
              style={{
                display: "inline-block",
                marginBottom: 20,
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Ready to start?
            </div>
            <h2>Your 7pm forecast is waiting.</h2>
            <p>
              Upload your POS CSV and get your first forecast in under 5
              minutes. No card required.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/sign-up" className="button button-lg">
                Start free — no card needed
              </Link>
              <Link
                href="/dashboard"
                className="button button-lg"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.35)",
                }}
              >
                Explore demo first
              </Link>
            </div>
          </div>
        </div>

        {/* ── FOOTER ────────────────────────────────────────────────── */}
        <footer className="landing-footer">
          <div className="landing-footer-inner">
            <Link href="/" className="marketing-logo">
              <div className="logo-icon" style={{ width: 24, height: 24 }}>
                <ForkcastIcon size={13} color="#ffffff" />
              </div>
              <span className="logo-text" style={{ fontSize: "0.9rem" }}>
                Forkcast
              </span>
            </Link>
            <div className="landing-footer-links">
              <Link href="/#how-it-works">How it works</Link>
              <Link href="/#features">Features</Link>
              <Link href="/#pricing">Pricing</Link>
              <Link href="/#accuracy">Accuracy</Link>
              <Link href="/sign-in">Sign in</Link>
              <Link href="/sign-up">Get started</Link>
            </div>
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-tertiary)",
              }}
            >
              Made for India 🇮🇳 · {new Date().getFullYear()}
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}
