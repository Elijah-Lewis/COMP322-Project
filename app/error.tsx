"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="app-shell">
      <section className="content" style={{ gridColumn: "1 / -1" }}>
        <div className="hero">
          <p className="eyebrow">Application error</p>
          <h1>We hit a recoverable runtime issue.</h1>
          <p>
            The page failed while rendering. Retry the route after the
            underlying issue is fixed, or return to the dashboard shell.
          </p>
          {error.digest ? (
            <p className="panel-note">Error digest: {error.digest}</p>
          ) : null}
          <div className="form-actions" style={{ marginTop: "1rem" }}>
            <button type="button" onClick={reset}>
              Try again
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
