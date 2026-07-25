"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="app-shell">
          <section className="content" style={{ gridColumn: "1 / -1" }}>
            <div className="hero">
              <p className="eyebrow">Fatal error</p>
              <h1>The app shell failed to initialize.</h1>
              <p>
                This boundary catches layout-level failures so the deployment
                can fail safely instead of leaving a blank screen.
              </p>
              {error.digest ? (
                <p className="panel-note">Error digest: {error.digest}</p>
              ) : null}
              <div className="form-actions" style={{ marginTop: "1rem" }}>
                <button type="button" onClick={reset}>
                  Retry
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => window.location.assign("/")}
                >
                  Go home
                </button>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
