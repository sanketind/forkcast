"use client";

import { useState } from "react";

import type { RecommendationBundle, SalesDay, SupplyAlert, SupplySeverity } from "@forkcast/domain";
import type { AccuracyPoint } from "@/lib/accuracy";
import { ForecastChart } from "@/components/forecast-chart";
import { HourlyChart } from "@/components/hourly-chart";

type Props = {
  bundle: RecommendationBundle;
  outletName: string;
  isDemo?: boolean;
  salesHistory: SalesDay[];
  targetDate: string;
  accuracyPoints: AccuracyPoint[];
};

const SEVERITY_LABEL: Record<SupplySeverity, string> = {
  critical: "CRITICAL",
  high: "HIGH",
  medium: "MEDIUM",
  low: "LOW"
};

const SEVERITY_COLOR: Record<SupplySeverity, string> = {
  critical: "#ef4444",
  high: "var(--warn)",
  medium: "#f59e0b",
  low: "var(--muted)"
};

function SupplyWatchPanel({ alerts }: { alerts: SupplyAlert[] }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [snoozed, setSnoozed] = useState<Set<string>>(new Set());

  const visible = alerts.filter(
    (a) => !dismissed.has(a.commodity) && !snoozed.has(a.commodity)
  );

  if (visible.length === 0) return null;

  const hasCritical = visible.some((a) => a.severity === "critical" || a.severity === "high");

  return (
    <section
      className="panel"
      style={{
        borderColor: hasCritical ? "rgba(239,68,68,0.35)" : "rgba(248,184,78,0.3)",
        background: hasCritical ? "rgba(239,68,68,0.06)" : "rgba(248,184,78,0.06)"
      }}
    >
      <div className="section-title">
        <div>
          <p className="eyebrow" style={{ color: hasCritical ? "#ef4444" : "var(--warn)" }}>
            Supply Watch
          </p>
          <h3>
            {visible.length} active alert{visible.length !== 1 ? "s" : ""}
          </h3>
        </div>
        <span
          className="pill"
          style={{
            background: hasCritical ? "rgba(239,68,68,0.18)" : "rgba(248,184,78,0.18)",
            color: hasCritical ? "#ef4444" : "var(--warn)"
          }}
        >
          Act now
        </span>
      </div>

      <div className="grid gap-4">
        {visible.map((alert) => (
          <article
            key={alert.commodity}
            style={{
              padding: "16px 18px",
              borderRadius: "16px",
              background: "rgba(7,17,31,0.5)",
              border: `1px solid ${SEVERITY_COLOR[alert.severity]}33`
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
                marginBottom: "10px"
              }}
            >
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span
                  className="pill"
                  style={{
                    background: `${SEVERITY_COLOR[alert.severity]}22`,
                    color: SEVERITY_COLOR[alert.severity],
                    fontWeight: 700,
                    fontSize: "0.75rem"
                  }}
                >
                  {SEVERITY_LABEL[alert.severity]}
                </span>
                <strong style={{ fontSize: "1rem" }}>{alert.commodity}</strong>
              </div>
              <span style={{ color: "var(--muted)", fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                Act within {alert.daysUntilImpact} day{alert.daysUntilImpact !== 1 ? "s" : ""}
              </span>
            </div>

            <p style={{ color: "var(--muted)", fontSize: "0.88rem", margin: "0 0 6px" }}>
              {alert.headline}
            </p>
            <p style={{ margin: "0 0 4px", fontWeight: 500 }}>→ {alert.recommendation}</p>
            <small style={{ color: "var(--muted)" }}>{alert.estimatedCostImpact}</small>

            {alert.affectedIngredients.length > 0 && (
              <p style={{ margin: "8px 0 0", fontSize: "0.8rem", color: "var(--muted)" }}>
                Affects: {alert.affectedIngredients.join(", ")}
              </p>
            )}

            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <button
                className="button secondary"
                style={{ fontSize: "0.8rem", padding: "7px 14px" }}
                onClick={() => setDismissed((prev) => new Set([...prev, alert.commodity]))}
              >
                Got it
              </button>
              <button
                className="button ghost"
                style={{ fontSize: "0.8rem", padding: "7px 14px" }}
                onClick={() => setSnoozed((prev) => new Set([...prev, alert.commodity]))}
              >
                Snooze 24h
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AccuracyPanel({ points }: { points: AccuracyPoint[] }) {
  if (points.length === 0) return null;

  const avgAccuracy = Math.round(points.reduce((s, p) => s + p.accuracyPct, 0) / points.length);
  const badgeClass = avgAccuracy >= 90 ? "good" : avgAccuracy >= 80 ? "fair" : "poor";

  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <p className="eyebrow">Model performance</p>
          <h3>Forecast accuracy — last 7 days</h3>
        </div>
        <div style={{ textAlign: "right" }}>
          <span
            className={`accuracy-badge ${badgeClass}`}
            style={{ fontSize: "1.1rem", padding: "6px 14px" }}
          >
            {avgAccuracy}%
          </span>
          <small style={{ display: "block", marginTop: "4px" }}>avg accuracy</small>
        </div>
      </div>

      <div>
        {points.map((p) => {
          const cls = p.accuracyPct >= 90 ? "good" : p.accuracyPct >= 80 ? "fair" : "poor";
          return (
            <div key={p.date} className="accuracy-row">
              <span style={{ color: "var(--text)", fontWeight: 500, fontSize: "0.85rem" }}>
                {p.dayLabel}
              </span>
              <small>
                Pred: <strong style={{ color: "var(--text)" }}>₹{p.predicted.toLocaleString("en-IN")}</strong>
              </small>
              <small>
                Actual: <strong style={{ color: "var(--text)" }}>₹{p.actual.toLocaleString("en-IN")}</strong>
              </small>
              <span className={`accuracy-badge ${cls}`}>{p.accuracyPct}%</span>
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: "16px", fontSize: "0.8rem", color: "var(--muted)" }}>
        Accuracy = 1 − |predicted − actual| / actual. Computed via walk-forward validation on your real POS data.
      </p>
    </section>
  );
}

export function DashboardClient({
  bundle,
  outletName,
  isDemo = false,
  salesHistory,
  targetDate,
  accuracyPoints
}: Props) {
  const [acceptedShopping, setAcceptedShopping] = useState(false);
  const [acceptedStaffing, setAcceptedStaffing] = useState(false);
  const [dismissedCards, setDismissedCards] = useState<Set<string>>(new Set());

  const handleAction = async (title: string, status: "accepted" | "dismissed") => {
    try {
      await fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status, forecastDate: targetDate })
      });
    } catch {
      // fire-and-forget — UI state already updated locally
    }
  };

  return (
    <div className="grid gap-6">
      {/* ── Hero forecast card ──────────────────────────────────────────────── */}
      <section className="hero-card">
        <p className="eyebrow">Tomorrow for {outletName}</p>
        <h2 style={{ fontSize: "1.6rem", letterSpacing: "-0.02em" }}>Do this tomorrow</h2>
        <div className="hero-metrics">
          <article>
            <span>Revenue forecast</span>
            <strong>₹{bundle.forecast.predictedRevenue.toLocaleString("en-IN")}</strong>
            <small>
              Range: ₹{bundle.forecast.confidenceLow.toLocaleString("en-IN")}–₹
              {bundle.forecast.confidenceHigh.toLocaleString("en-IN")}
            </small>
          </article>
          <article>
            <span>Expected orders</span>
            <strong>{bundle.forecast.predictedOrders}</strong>
            <small>{bundle.forecast.reasons[0]}</small>
          </article>
          {isDemo && (
            <article style={{ borderColor: "rgba(248,184,78,0.3)" }}>
              <span style={{ color: "var(--warn)" }}>Demo data</span>
              <strong style={{ fontSize: "1rem" }}>Upload POS to see real numbers</strong>
              <small>
                <a href="/onboarding" style={{ color: "var(--accent)" }}>
                  Start onboarding →
                </a>
              </small>
            </article>
          )}
        </div>
      </section>

      {/* ── 7-day revenue chart ─────────────────────────────────────────────── */}
      <section className="panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">Revenue trend</p>
            <h3>7-day actuals + tomorrow's forecast</h3>
          </div>
          <span className="pill">
            {bundle.forecast.reasons.length} signal{bundle.forecast.reasons.length !== 1 ? "s" : ""} detected
          </span>
        </div>
        <div className="chart-wrapper">
          <ForecastChart
            salesHistory={salesHistory}
            forecast={bundle.forecast}
            targetDate={targetDate}
          />
        </div>
        {bundle.forecast.reasons.length > 1 && (
          <p style={{ marginTop: "12px", fontSize: "0.82rem", color: "var(--muted)" }}>
            {bundle.forecast.reasons[1]}
          </p>
        )}
      </section>

      {/* ── Supply Watch ───────────────────────────────────────────────────── */}
      {bundle.supplyAlerts.length > 0 && (
        <SupplyWatchPanel alerts={bundle.supplyAlerts} />
      )}

      {/* ── Shopping list + Staffing ────────────────────────────────────────── */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Shopping list */}
        <article className="panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Inventory</p>
              <h3>Shopping list</h3>
            </div>
            <button
              className={`button ${acceptedShopping ? "secondary" : ""}`}
              style={{ minWidth: "120px" }}
              onClick={() => {
                setAcceptedShopping(true);
                void handleAction("Shopping list", "accepted");
              }}
            >
              {acceptedShopping ? "✓ Accepted" : "Accept list"}
            </button>
          </div>
          {bundle.shoppingList.length > 0 ? (
            <ul className="stack-list">
              {bundle.shoppingList.map((item) => (
                <li key={item.ingredient}>
                  <strong>
                    {item.ingredient}: {item.quantityToBuy} {item.unit}
                  </strong>
                  <span>{item.rationale}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              No purchases needed — current stock covers tomorrow&apos;s projected demand.
            </p>
          )}
        </article>

        {/* Staffing */}
        <article className="panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Staffing</p>
              <h3>Peak-hour plan</h3>
            </div>
            <button
              className={`button ${acceptedStaffing ? "secondary" : ""}`}
              style={{ minWidth: "130px" }}
              onClick={() => {
                setAcceptedStaffing(true);
                void handleAction("Staffing", "accepted");
              }}
            >
              {acceptedStaffing ? "✓ Scheduled" : "Accept staffing"}
            </button>
          </div>
          <div className="metric-card" style={{ marginBottom: "16px" }}>
            <strong style={{ fontSize: "1.3rem" }}>
              {bundle.staffing.cooksNeeded} cooks · {bundle.staffing.serviceStaffNeeded} floor staff
            </strong>
            <p style={{ color: "var(--muted)", margin: "4px 0 0" }}>
              {bundle.staffing.shiftStartHour}:00 – {bundle.staffing.shiftEndHour}:00
            </p>
            <span style={{ fontSize: "0.85rem" }}>{bundle.staffing.rationale}</span>
          </div>

          {/* Hourly orders chart */}
          {bundle.forecast.hourlyOrders && bundle.forecast.hourlyOrders.length > 0 && (
            <>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "6px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Hourly order pattern
              </p>
              <div style={{ height: "120px" }}>
                <HourlyChart hourlyOrders={bundle.forecast.hourlyOrders} />
              </div>
            </>
          )}
        </article>
      </section>

      {/* ── Action cards ────────────────────────────────────────────────────── */}
      <section className="panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">Action cards</p>
            <h3>Prioritized recommendations</h3>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {bundle.actionCards
            .filter((card) => !dismissedCards.has(card.title))
            .map((card) => (
              <article className="action-card" key={card.title}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "8px",
                    marginBottom: "10px"
                  }}
                >
                  <p
                    className="pill"
                    style={{
                      background:
                        card.priority === 1
                          ? "rgba(239,68,68,0.18)"
                          : card.priority === 2
                            ? "rgba(248,184,78,0.18)"
                            : "var(--accent-soft)"
                    }}
                  >
                    {card.category}
                  </p>
                  <button
                    className="button ghost"
                    style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                    onClick={() => {
                      setDismissedCards((prev) => new Set([...prev, card.title]));
                      void handleAction(card.title, "dismissed");
                    }}
                  >
                    Dismiss
                  </button>
                </div>
                <h4 style={{ fontSize: "0.95rem", marginBottom: "6px" }}>{card.title}</h4>
                <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "6px" }}>
                  {card.explanation}
                </p>
                <small>{card.expectedImpact}</small>
              </article>
            ))}
          {bundle.actionCards.every((c) => dismissedCards.has(c.title)) && (
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", gridColumn: "1 / -1" }}>
              All action cards dismissed for today.
            </p>
          )}
        </div>
      </section>

      {/* ── Forecast drivers ────────────────────────────────────────────────── */}
      <section className="panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">Why the model says this</p>
            <h3>Forecast drivers</h3>
          </div>
        </div>
        <ul className="stack-list">
          {bundle.forecast.reasons.map((reason) => (
            <li key={reason} style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              {reason}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Forecast accuracy tracker ────────────────────────────────────────── */}
      <AccuracyPanel points={accuracyPoints} />
    </div>
  );
}
