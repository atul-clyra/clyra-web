"use client";

import { useEffect } from "react";

/** Static-export redirect for retired URLs: meta refresh without JS, location.replace with it. */
export function Redirect({ to, label }: { to: string; label: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return (
    <div className="c-404">
      <meta content={`0; url=${to}`} httpEquiv="refresh" />
      <div>
        <h1>Taking you to {label}.</h1>
        <a href={to}>Continue</a>
      </div>
    </div>
  );
}
