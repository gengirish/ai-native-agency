/**
 * Warms up Turbopack compilation by hitting key routes before tests run.
 * Prevents first-test compilation penalties from causing timeouts.
 */
export default async function globalSetup() {
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000"

  const warmupPaths = [
    "/api/auth/login",
    "/api/auth/me",
    "/api/dashboard/stats",
    "/api/projects",
    "/api/reviews",
    "/api/experts",
    "/api/billing",
    "/api/brands",
    "/api/health",
  ]

  console.log("Warming up Turbopack compilations...")

  await Promise.allSettled(
    warmupPaths.map((path) =>
      fetch(`${baseURL}${path}`, { signal: AbortSignal.timeout(30000) }).catch(() => {})
    )
  )

  // Also warm up the login page and dashboard page routes
  await Promise.allSettled([
    fetch(`${baseURL}/login`, { signal: AbortSignal.timeout(30000) }).catch(() => {}),
    fetch(`${baseURL}/dashboard`, {
      signal: AbortSignal.timeout(30000),
      headers: { Cookie: "agencyos_token=warmup" },
    }).catch(() => {}),
  ])

  console.log("Warmup complete")
}
