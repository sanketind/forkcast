export default function DashboardLoading() {
  return (
    <div className="grid gap-6">
      {/* Hero skeleton */}
      <section className="hero-card">
        <div className="skeleton" style={{ height: "14px", width: "140px", marginBottom: "12px" }} />
        <div className="skeleton" style={{ height: "28px", width: "240px", marginBottom: "20px" }} />
        <div className="hero-metrics">
          {[1, 2].map((i) => (
            <article key={i}>
              <div className="skeleton" style={{ height: "12px", width: "80px", marginBottom: "10px" }} />
              <div className="skeleton" style={{ height: "36px", width: "160px", marginBottom: "8px" }} />
              <div className="skeleton" style={{ height: "11px", width: "200px" }} />
            </article>
          ))}
        </div>
      </section>

      {/* Chart skeleton */}
      <section className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <div className="skeleton" style={{ height: "12px", width: "100px", marginBottom: "8px" }} />
            <div className="skeleton" style={{ height: "22px", width: "180px" }} />
          </div>
        </div>
        <div className="skeleton chart-wrapper" />
      </section>

      {/* Two-col skeleton */}
      <section className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <article key={i} className="panel">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <div className="skeleton" style={{ height: "12px", width: "80px", marginBottom: "8px" }} />
                <div className="skeleton" style={{ height: "22px", width: "150px" }} />
              </div>
              <div className="skeleton" style={{ height: "36px", width: "100px", borderRadius: "14px" }} />
            </div>
            {[1, 2, 3].map((j) => (
              <div key={j} style={{ marginBottom: "14px" }}>
                <div className="skeleton" style={{ height: "13px", width: "80%", marginBottom: "5px" }} />
                <div className="skeleton" style={{ height: "11px", width: "60%" }} />
              </div>
            ))}
          </article>
        ))}
      </section>

      {/* Action cards skeleton */}
      <section className="panel">
        <div style={{ marginBottom: "20px" }}>
          <div className="skeleton" style={{ height: "12px", width: "90px", marginBottom: "8px" }} />
          <div className="skeleton" style={{ height: "22px", width: "220px" }} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <article key={i} className="action-card">
              <div className="skeleton" style={{ height: "24px", width: "80px", borderRadius: "999px", marginBottom: "12px" }} />
              <div className="skeleton" style={{ height: "16px", width: "90%", marginBottom: "8px" }} />
              <div className="skeleton" style={{ height: "12px", width: "75%", marginBottom: "6px" }} />
              <div className="skeleton" style={{ height: "11px", width: "55%" }} />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
