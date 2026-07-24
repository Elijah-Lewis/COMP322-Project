export default function Loading() {
  return (
    <main className="app-shell" aria-busy="true" aria-live="polite">
      <aside className="sidebar skeleton-panel">
        <div className="skeleton-line skeleton-kicker" />
        <div className="skeleton-line skeleton-heading" />
        <div className="skeleton-grid">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </aside>

      <section className="content">
        <div className="hero skeleton-panel">
          <div className="skeleton-line skeleton-kicker" />
          <div className="skeleton-line skeleton-heading" />
          <div
            className="skeleton-line"
            style={{ width: "85%", marginBottom: "0.6rem" }}
          />
          <div className="skeleton-line" style={{ width: "62%" }} />
        </div>

        <div className="content-grid">
          <div className="stack">
            <section className="panel skeleton-panel">
              <div className="skeleton-line skeleton-kicker" />
              <div className="skeleton-line skeleton-heading" />
              <div className="skeleton-grid">
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
              </div>
            </section>

            <section className="panel skeleton-panel">
              <div className="skeleton-line skeleton-kicker" />
              <div className="skeleton-line skeleton-heading" />
              <div className="skeleton-grid">
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
              </div>
            </section>
          </div>

          <section className="panel skeleton-panel">
            <div className="skeleton-line skeleton-kicker" />
            <div className="skeleton-line skeleton-heading" />
            <div className="skeleton-table">
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
