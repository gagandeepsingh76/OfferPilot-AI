"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>We could not load OfferPilot AI</h1>
            <p style={{ color: "#52525b", marginBottom: "1.5rem" }}>
              The issue has been logged. Please retry the page.
            </p>
            <button
              onClick={() => reset()}
              style={{ border: 0, borderRadius: "0.5rem", background: "#111827", color: "white", padding: "0.625rem 1rem", cursor: "pointer" }}
            >
              Retry
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
