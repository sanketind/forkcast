"use client";

import { useState } from "react";

import type { RecommendationBundle, SalesDay, SupplyAlert, SupplySeverity } from "@forkcast/domain";
import type { AccuracyPoint } from "@/lib/accuracy";
import { ForecastChart } from "@/components/forecast-chart";
import { HourlyChart } from "@/components/hourly-chart";
import { SkuChart } from "@/components/sku-chart";

type Props = {
  bundle: RecommendationBundle;
  outletName: string;
  isDemo?: boolean;
  salesHistory: SalesDay[];
  targetDate: string;
  accuracyPoints: AccuracyPoint[];
};

const SEVERITY_COLOR: Record<SupplySeverity, string> = {
  critical: "var(--red)",
  high: "var(--amber)",
  medium: "var(--amber)",
  low: "var(--text-secondary)"
};

const SEVERITY_BG: Record<SupplySeverity, string> = {
  critical: "var(--red-soft)",
  high: "var(--amber-soft)",
  medium: "var(--amber-soft)",
  low: "var(--surface-raised)"
};

const SEVERITY_BORDER: Record<SupplySeverity, string> = {
  critical: "rgba(193,53,21,0.25)",
  high: "rgba(255,180,0,0.3)",
  medium: "rgba(255,180,0,0.2)",
  low: "var(--border)"
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
    <section className="panel">
      <div className="section-title">
        <div>
          <p className="eyebrow" style={{ color: hasCritical ? "var(--red)" : "var(--amber)" }}>
            Supply Watch
          </p>
          <h3 style={{ fontSize: "var(--text-lg)", letterSpacing: "-0.01em" }}>
            {visible.length} active alert{visible.length !== 1 ? "s" : ""}
          </h3>
        </div>
        <span className={`pill ${hasCritical ? "red" : "amber"}`}>
          Act now
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {visible.map((alert) => (
          <div
            key={alert.commodity}
            style={{
              padding: "16px 18px",
              borderRadius: 10,
              background: SEVERITY_BG[alert.severity],
              border: `1px solid ${SEVERITY_BORDER[alert.severity]}`,
              position: "relative"
            }}
          >
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, borderRadius: "3px 0 0 3px", background: SEVERITY_COLOR[alert.severity] }} />
            <div style={{ paddingLeft: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className={`pill ${alert.severity === "critical" ? "red" : alert.severity === "low" ? "" : "amber"}`} style={{ fontSize: "0.68rem" }}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <strong style={{ fontSize: "var(--text-sm)", color: "var(--text)" }}>{alert.commodity}</strong>
                </div>
                <span style={{ color: "var(--text-tertiary)", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                  {alert.daysUntilImpact}d to act
                </span>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", margin: "0 0 4px" }}>
                {alert.headline}
              </p>
              <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--text)" }}>
                → {alert.recommendation}
              </p>
              {alert.estimatedCostImpact && (
                <p style={{ margin: "0 0 10px", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                  {alert.estimatedCostImpact}
                </p>
              )}
              {alert.affectedIngredients.length > 0 && (
                <p style={{ margin: "0 0 10px", fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                  Affects: {alert.affectedIngredients.join(", ")}
                </p>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="button secondary button-sm"
                  onClick={() => setDismissed((prev) => new Set([...prev, alert.commodity]))}
                >
                  Got it
                </button>
                <button
                  className="button ghost button-sm"
                  onClick={() => setSnoozed((prev) => new Set([...prev, alert.commodity]))}
                >
                  Snooze 24h
                </button>
              </div>
            </div>
          </div>
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
          <h3 style={{ fontSize: "var(--text-lg)", letterSpacing: "-0.01em" }}>
            Forecast accuracy — last 7 days
          </h3>
        </div>
        <div style={{ textAlign: "right" }}>
          <span className={`accuracy-badge ${badgeClass}`} style={{ fontSize: "1.1rem", padding: "6px 16px" }}>
            {avgAccuracy}%
          </span>
          <p style={{ margin: "4px 0 0", fontSize: "0.72rem", color: "var(--text-tertiary)" }}>avg accuracy</p>
        </div>
      </div>

      <div>
        {points.map((p) => {
          const cls = p.accuracyPct >= 90 ? "good" : p.accuracyPct >= 80 ? "fair" : "poor";
          return (
            <div key={p.date} className="accuracy-row">
              <span style={{ color: "var(--text)", fontWeight: 600, fontSize: "var(--text-sm)" }}>
                {p.dayLabel}
              </span>
              <span style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                ₹{p.predicted.toLocaleString("en-IN")}
              </span>
              <span style={{ color: "var(--text)", fontSize: "var(--text-sm)", fontWeight: 500 }}>
                ₹{p.actual.toLocaleString("en-IN")}
              </span>
              <span className={`accuracy-badge ${cls}`}>{p.accuracyPct}%</span>
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: 14, fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
        Accuracy = 1 − |predicted − actual| / actual · walk-forward validation on your POS data
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
  const [acceptedCards, setAcceptedCards] = useState<Set<string>>(new Set());
  const [showSyncModal, setShowSyncModal] = useState(false);

  const handleAction = async (title: string, status: "accepted" | "dismissed") => {
    try {
      await fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status, forecastDate: targetDate })
      });
    } catch {
      // fire-and-forget
    }
  };

  return (
    <div className="grid gap-6">

      {/* ── KPI Row ──────────────────────────────────────────────── */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12l4-4 3 3 5-6"/>
            </svg>
          </div>
          <div className="kpi-label">Revenue forecast</div>
          <div className="kpi-value">₹{(bundle.forecast.predictedRevenue / 1000).toFixed(1)}k</div>
          <div className="kpi-delta neutral">
            ₹{bundle.forecast.confidenceLow.toLocaleString("en-IN")} – ₹{bundle.forecast.confidenceHigh.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ color: "var(--indigo)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="14" height="9" rx="2"/>
              <path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1"/>
            </svg>
          </div>
          <div className="kpi-label">Expected orders</div>
          <div className="kpi-value">{bundle.forecast.predictedOrders}</div>
          <div className="kpi-delta neutral" style={{ color: "var(--text-secondary)" }}>
            orders tomorrow
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ color: "var(--amber)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="7" r="4"/>
              <path d="M4 14c0-2.2 1.8-4 4-4s4 1.8 4 4"/>
            </svg>
          </div>
          <div className="kpi-label">Staff needed</div>
          <div className="kpi-value">{bundle.staffing.cooksNeeded + bundle.staffing.serviceStaffNeeded}</div>
          <div className="kpi-delta neutral" style={{ color: "var(--text-secondary)" }}>
            {bundle.staffing.cooksNeeded} cooks · {bundle.staffing.serviceStaffNeeded} floor
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ color: "var(--red)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4h12M5 4V3h6v1M4 4l1 9h6l1-9"/>
            </svg>
          </div>
          <div className="kpi-label">Shopping items</div>
          <div className="kpi-value">{bundle.shoppingList.length}</div>
          <div className="kpi-delta neutral" style={{ color: "var(--text-secondary)" }}>
            ingredients to buy
          </div>
        </div>
      </div>

      {/* ── Hero forecast card ────────────────────────────────────── */}
      <section className="hero-card">
        <p className="eyebrow">Tomorrow · {outletName}</p>
        <h2 style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em", marginBottom: 8 }}>
          ₹{bundle.forecast.predictedRevenue.toLocaleString("en-IN")}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", margin: "0 0 20px" }}>
          Confidence range: ₹{bundle.forecast.confidenceLow.toLocaleString("en-IN")} – ₹{bundle.forecast.confidenceHigh.toLocaleString("en-IN")}
        </p>
        {bundle.forecast.reasons[0] && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)", flexShrink: 0 }} />
            <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
              {bundle.forecast.reasons[0]}
            </span>
          </div>
        )}
      </section>

      {/* ── 7-day revenue chart ───────────────────────────────────── */}
      <section className="panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">Revenue trend</p>
            <h3 style={{ fontSize: "var(--text-lg)", letterSpacing: "-0.01em" }}>
              7-day actuals + tomorrow&apos;s forecast
            </h3>
          </div>
          <span className="pill accent">
            {bundle.forecast.reasons.length} signal{bundle.forecast.reasons.length !== 1 ? "s" : ""}
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
          <p style={{ marginTop: 12, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            {bundle.forecast.reasons[1]}
          </p>
        )}
      </section>

      {/* ── SKU forecast chart ────────────────────────────────────── */}
      {Object.keys(bundle.forecast.skuForecast).length > 0 && (
        <section className="panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Menu tomorrow</p>
              <h3 style={{ fontSize: "var(--text-lg)", letterSpacing: "-0.01em" }}>Expected orders by dish</h3>
            </div>
            <span className="pill">
              {Object.keys(bundle.forecast.skuForecast).length} items
            </span>
          </div>
          <div style={{ height: 220 }}>
            <SkuChart skuForecast={bundle.forecast.skuForecast} />
          </div>
          <p style={{ marginTop: 12, fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            Top dish drives your shopping list. Prep quantities scale to these projections.
          </p>
        </section>
      )}

      {/* ── Supply Watch ──────────────────────────────────────────── */}
      {bundle.supplyAlerts.length > 0 && (
        <SupplyWatchPanel alerts={bundle.supplyAlerts} />
      )}

      {/* ── Shopping list + Staffing ──────────────────────────────── */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Shopping list */}
        <article className="panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Inventory</p>
              <h3 style={{ fontSize: "var(--text-lg)", letterSpacing: "-0.01em" }}>Shopping list</h3>
            </div>
            <button
              className={`button button-sm ${acceptedShopping ? "secondary" : ""}`}
              onClick={() => {
                setAcceptedShopping(true);
                void handleAction("Shopping list", "accepted");
              }}
            >
              {acceptedShopping ? "✓ Accepted" : "Accept list"}
            </button>
          </div>
          {bundle.shoppingList.length > 0 ? (
            <div className="table-shell">
              <table>
                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th>Qty</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {bundle.shoppingList.map((item) => (
                    <tr key={item.ingredient}>
                      <td style={{ fontWeight: 600 }}>{item.ingredient}</td>
                      <td style={{ color: "var(--teal)", fontWeight: 700 }}>{item.quantityToBuy}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
              No purchases needed — current stock covers tomorrow&apos;s demand.
            </p>
          )}
        </article>

        {/* Staffing */}
        <article className="panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Staffing</p>
              <h3 style={{ fontSize: "var(--text-lg)", letterSpacing: "-0.01em" }}>Peak-hour plan</h3>
            </div>
            <button
              className={`button button-sm ${acceptedStaffing ? "secondary" : ""}`}
              onClick={() => {
                setAcceptedStaffing(true);
                void handleAction("Staffing", "accepted");
              }}
            >
              {acceptedStaffing ? "✓ Scheduled" : "Accept plan"}
            </button>
          </div>
          <div className="metric-card" style={{ marginBottom: 16 }}>
            <strong style={{ fontSize: "var(--text-2xl)" }}>
              {bundle.staffing.cooksNeeded} cooks · {bundle.staffing.serviceStaffNeeded} floor
            </strong>
            <p style={{ color: "var(--text-secondary)", margin: "4px 0 0", fontSize: "var(--text-sm)" }}>
              {bundle.staffing.shiftStartHour}:00 – {bundle.staffing.shiftEndHour}:00
            </p>
            <p style={{ color: "var(--text-secondary)", margin: "6px 0 0", fontSize: "var(--text-sm)" }}>
              {bundle.staffing.rationale}
            </p>
          </div>

          {bundle.forecast.hourlyOrders && bundle.forecast.hourlyOrders.length > 0 && (
            <>
              <p style={{ fontSize: "0.68rem", color: "var(--text-tertiary)", marginBottom: 6, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Hourly order pattern
              </p>
              <div style={{ height: 100 }}>
                <HourlyChart hourlyOrders={bundle.forecast.hourlyOrders} />
              </div>
            </>
          )}
        </article>
      </section>

      {/* ── Action cards ──────────────────────────────────────────── */}
      <section className="panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">Action cards</p>
            <h3 style={{ fontSize: "var(--text-lg)", letterSpacing: "-0.01em" }}>Prioritized recommendations</h3>
          </div>
          {acceptedCards.size > 0 && (
            <span className="pill accent">{acceptedCards.size} accepted</span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {bundle.actionCards
            .filter((card) => !dismissedCards.has(card.title))
            .map((card) => {
              const isAccepted = acceptedCards.has(card.title);
              const barClass =
                card.priority === 1 ? "priority-1" : card.priority === 2 ? "priority-2" : "priority-3";

              return (
                <div
                  key={card.title}
                  className="action-card"
                  style={{
                    opacity: isAccepted ? 0.6 : 1,
                    transition: "opacity 0.2s"
                  }}
                >
                  <div className={`action-card-bar ${barClass}`} />
                  <div style={{ paddingLeft: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className={`pill ${card.priority === 1 ? "red" : card.priority === 2 ? "amber" : "accent"}`} style={{ fontSize: "0.65rem" }}>
                          {card.category}
                        </span>
                      </div>
                      <button
                        className="button ghost button-sm"
                        style={{ padding: "3px 8px", fontSize: "0.72rem" }}
                        onClick={() => {
                          setDismissedCards((prev) => new Set([...prev, card.title]));
                          void handleAction(card.title, "dismissed");
                        }}
                      >
                        Dismiss
                      </button>
                    </div>
                    <h4 style={{ fontSize: "var(--text-sm)", marginBottom: 4, color: "var(--text)", fontWeight: 600 }}>
                      {card.title}
                    </h4>
                    <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: 10 }}>
                      {card.explanation}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--text-tertiary)", fontSize: "0.75rem" }}>{card.expectedImpact}</span>
                      <button
                        className={`button button-sm ${isAccepted ? "secondary" : ""}`}
                        onClick={() => {
                          setAcceptedCards((prev) => new Set([...prev, card.title]));
                          void handleAction(card.title, "accepted");
                        }}
                        disabled={isAccepted}
                      >
                        {isAccepted ? "✓ Done" : "Accept"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          {bundle.actionCards.every((c) => dismissedCards.has(c.title)) && (
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
              All action cards dismissed for today.
            </p>
          )}
        </div>
      </section>

      {/* ── Forecast drivers ──────────────────────────────────────── */}
      <section className="panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">Why the model says this</p>
            <h3 style={{ fontSize: "var(--text-lg)", letterSpacing: "-0.01em" }}>Forecast drivers</h3>
          </div>
        </div>
        <div className="driver-list">
          {bundle.forecast.reasons.map((reason) => (
            <div key={reason} className="driver-item">
              <div className="driver-dot" />
              {reason}
            </div>
          ))}
        </div>
      </section>

      {/* ── Data freshness ────────────────────────────────────────── */}
      <section
        className="panel"
        style={{ borderColor: isDemo ? "rgba(255,180,0,0.25)" : "rgba(0,166,153,0.2)" }}
      >
        <div className="section-title">
          <div>
            <p className="eyebrow" style={{ color: isDemo ? "var(--amber)" : "var(--accent)" }}>
              Data freshness
            </p>
            <h3 style={{ fontSize: "var(--text-lg)", letterSpacing: "-0.01em" }}>Keep data fresh</h3>
          </div>
          <button
            className="button ghost button-sm"
            onClick={() => setShowSyncModal((v) => !v)}
          >
            {showSyncModal ? "Cancel" : isDemo ? "Upload data" : "Upload more"}
          </button>
        </div>

        {!showSyncModal && (
          isDemo ? (
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
              Running on demo data.{" "}
              <a href="/onboarding" className="accent-link">Upload your POS CSV</a>{" "}
              to get forecasts from your real sales history.
            </p>
          ) : (
            <div className="freshness-grid">
              <div className="freshness-item">
                <div className="freshness-label">Last synced</div>
                <div className="freshness-value">
                  {salesHistory.length > 0
                    ? new Date(salesHistory[salesHistory.length - 1].date + "T00:00:00Z")
                        .toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
                    : "—"}
                </div>
              </div>
              <div className="freshness-item">
                <div className="freshness-label">Days of history</div>
                <div className="freshness-value">{salesHistory.length} days</div>
              </div>
              <div className="freshness-item">
                <div className="freshness-label">Forecast quality</div>
                <div className="freshness-value" style={{ color: salesHistory.length >= 14 ? "var(--teal)" : salesHistory.length >= 7 ? "var(--amber)" : "var(--red)" }}>
                  {salesHistory.length >= 14 ? "Excellent" : salesHistory.length >= 7 ? "Good" : "Needs more data"}
                </div>
              </div>
            </div>
          )
        )}

        {showSyncModal && (
          <div style={{ marginTop: 8, padding: 18, borderRadius: 10, background: "var(--surface-raised)", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: 14 }}>
              Upload your latest weekly POS export. New data will be merged — no duplicates.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="/onboarding" className="button button-sm">
                Go to upload wizard →
              </a>
              <button className="button ghost button-sm" onClick={() => setShowSyncModal(false)}>
                Cancel
              </button>
            </div>
            <p style={{ marginTop: 10, fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
              Formats: Petpooja · UrbanPiper · Posist · Forkcast Standard CSV
            </p>
          </div>
        )}
      </section>

      {/* ── Forecast accuracy tracker ─────────────────────────────── */}
      <AccuracyPanel points={accuracyPoints} />
    </div>
  );
}
