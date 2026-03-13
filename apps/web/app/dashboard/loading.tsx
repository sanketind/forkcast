export default function DashboardLoading() {
  return (
    <div className="grid gap-6">
      {/* KPI row skeleton */}
      <div className="kpi-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="kpi-card">
            <div className="skeleton" style={{ height: 10, width: 80, marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 36, width: 120, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 10, width: 100 }} />
          </div>
        ))}
      </div>

      {/* Hero card skeleton */}
      <section className="hero-card">
        <div className="skeleton" style={{ height: 12, width: 140, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 40, width: 200, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: 280 }} />
      </section>

      {/* Chart skeleton */}
      <section className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div className="skeleton" style={{ height: 10, width: 100, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 22, width: 220 }} />
          </div>
          <div className="skeleton" style={{ height: 26, width: 80, borderRadius: 999 }} />
        </div>
        <div className="skeleton chart-wrapper" />
      </section>

      {/* Shopping + staffing skeleton */}
      <section className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <article key={i} className="panel">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div className="skeleton" style={{ height: 10, width: 70, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 20, width: 130 }} />
              </div>
              <div className="skeleton" style={{ height: 32, width: 90, borderRadius: 8 }} />
            </div>
            {[1, 2, 3, 4].map((j) => (
              <div key={j} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <div className="skeleton" style={{ height: 12, width: "60%", borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 12, width: "20%", borderRadius: 4 }} />
              </div>
            ))}
          </article>
        ))}
      </section>

      {/* Action cards skeleton */}
      <section className="panel">
        <div style={{ marginBottom: 20 }}>
          <div className="skeleton" style={{ height: 10, width: 90, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 22, width: 200 }} />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ marginBottom: 10, padding: "16px 18px 16px 24px", borderRadius: 10, background: "var(--surface-raised)", border: "1px solid var(--border)" }}>
            <div className="skeleton" style={{ height: 10, width: 80, borderRadius: 999, marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 14, width: "80%", marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 11, width: "65%", marginBottom: 6 }} />
            <div className="skeleton" style={{ height: 10, width: "45%" }} />
          </div>
        ))}
      </section>
    </div>
  );
}
