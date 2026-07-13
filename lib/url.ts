import { headers } from "next/headers"

export function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "")
}

export function sanitizeRedirectPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback
  }

  return value
}

export async function getAppUrl() {
  const headerStore = await headers()
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL
  const origin = headerStore.get("origin")
  const forwardedHost = headerStore.get("x-forwarded-host")
  const forwardedProto = headerStore.get("x-forwarded-proto") || "https"

  if (configuredUrl && !configuredUrl.includes("your-domain.com")) {
    return stripTrailingSlash(configuredUrl)
  }

  if (origin) {
    return stripTrailingSlash(origin)
  }

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }

  return "https://offerpilot.ai"
}
